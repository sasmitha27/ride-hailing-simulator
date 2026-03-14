import { Prisma } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";
import { buildCityGraph, CITY_NODES, nearestGraphNode } from "../algorithms/cityGraph";
import { dijkstra } from "../algorithms/dijkstra";
import { haversineDistanceKm } from "../algorithms/geo";
import { prisma } from "../prisma";
import { RideRequestManager } from "../queue/RideRequestManager";
import { MatchingService } from "./MatchingService";

const averageSpeedKmh = Number(process.env.AVERAGE_SPEED_KMH ?? 30);
const searchRadiusKm = Number(process.env.DRIVER_SEARCH_RADIUS_KM ?? 5);
const autoRequestBatchSize = Number(process.env.AUTO_REQUEST_BATCH_SIZE ?? 2);
const autoRequestIntervalMs = Number(process.env.AUTO_REQUEST_INTERVAL_MS ?? 10000);
const cityGraph = buildCityGraph();

export class SimulationEngine {
  private requestManager = new RideRequestManager();
  private matcher = new MatchingService(averageSpeedKmh, searchRadiusKm);
  private processing = false;
  private randomMoverStarted = false;
  private autoRequesterStarted = false;

  constructor(private readonly io: SocketIOServer) {}

  startAutomaticCustomerRequests(batchSize = autoRequestBatchSize, intervalMs = autoRequestIntervalMs): void {
    if (this.autoRequesterStarted) return;
    this.autoRequesterStarted = true;

    setInterval(() => {
      this.generateCustomerRideRequests(batchSize).catch((error) => {
        console.error("Automatic customer request generation failed", error);
      });
    }, intervalMs);
  }

  startRandomDriverMovement(count = 5, intervalMs = 2000): void {
    if (this.randomMoverStarted) return;
    this.randomMoverStarted = true;

    setInterval(async () => {
      try {
        const drivers = await prisma.driver.findMany({ where: { status: "available" } });
        if (drivers.length === 0) return;

        // pick up to `count` random drivers
        const selected: typeof drivers = [];
        const shuffled = drivers.sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(count, shuffled.length); i++) selected.push(shuffled[i]);

        for (const d of selected) {
          // small random move (approx meters)
          const deltaLat = (Math.random() - 0.5) * 0.001; // ~ +-111m * 0.001 = ~0.11m? small step
          const deltaLng = (Math.random() - 0.5) * 0.001;
          const newLat = Number((d.latitude + deltaLat).toFixed(6));
          const newLng = Number((d.longitude + deltaLng).toFixed(6));

          await prisma.driver.update({
            where: { id: d.id },
            data: { latitude: newLat, longitude: newLng }
          });

          this.io.emit("driver:moved", {
            driverId: d.id,
            latitude: newLat,
            longitude: newLng,
            random: true
          });
        }
      } catch (err) {
        console.error("Random mover error", err);
      }
    }, intervalMs);
  }

  async bootstrapQueues(): Promise<void> {
    const pending = await prisma.rideRequest.findMany({
      where: { status: "waiting" },
      orderBy: { createdAt: "asc" }
    });

    for (const request of pending) {
      this.requestManager.enqueue({
        ...request,
        createdAt: request.createdAt
      });
    }
  }

  async enqueueRequest(requestId: number): Promise<void> {
    const request = await prisma.rideRequest.findUnique({ where: { id: requestId } });
    if (!request || request.status !== "waiting") {
      return;
    }

    this.requestManager.enqueue({ ...request, createdAt: request.createdAt });
    this.io.emit("queue:updated", this.requestManager.toArray());
    await this.processQueue();
  }

  async processQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (!this.requestManager.isEmpty()) {
      const request = this.requestManager.dequeue();
      if (!request) {
        break;
      }

      const availableDrivers = await prisma.driver.findMany({
        where: { status: "available" }
      });

      const best = this.matcher.greedyMatch(availableDrivers, request);

      if (!best) {
        this.requestManager.enqueue(request);
        break;
      }

      const ride = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.driver.update({
          where: { id: best.driver.id },
          data: { status: "busy" }
        });

        await tx.rideRequest.update({
          where: { id: request.id },
          data: { status: "matched" }
        });

        return tx.ride.create({
          data: {
            driverId: best.driver.id,
            requestId: request.id,
            distance: best.routeDistanceKm,
            status: "assigned"
          },
          include: {
            driver: true,
            request: true
          }
        });
      });

      this.io.emit("ride:assigned", {
        ride,
        etaMinutes: best.etaMinutes,
        routePath: best.routePath,
        algorithm: {
          strategy: "Greedy nearest-driver",
          scoreFormula: "distance_to_passenger + estimated_arrival_time"
        }
      });

      this.simulateDriverJourney(ride.id, best.routePath, best.driver.id).catch((error) => {
        console.error("Failed to simulate ride", error);
      });
    }

    this.io.emit("queue:updated", this.requestManager.toArray());
    this.processing = false;
  }

  async getSimulationState(): Promise<unknown> {
    const [drivers, requests, rides] = await Promise.all([
      prisma.driver.findMany({ orderBy: { id: "asc" } }),
      prisma.rideRequest.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.ride.findMany({
        include: { driver: true, request: true },
        orderBy: { id: "desc" },
        take: 20
      })
    ]);

    return {
      drivers,
      requests,
      rides,
      queue: this.requestManager.toArray()
    };
  }

  private async generateCustomerRideRequests(batchSize: number): Promise<void> {
    const [customers, availableDrivers] = await Promise.all([
      prisma.customer.findMany({ orderBy: { id: "asc" } }),
      prisma.driver.findMany({ where: { status: "available" } })
    ]);

    if (customers.length === 0 || availableDrivers.length === 0) {
      return;
    }

    const candidateRequests = customers
      .map((customer) => {
        const nearbyDrivers = this.matcher.findNearbyDrivers(availableDrivers, {
          id: -customer.id,
          passengerLat: customer.latitude,
          passengerLng: customer.longitude,
          destinationLat: customer.latitude,
          destinationLng: customer.longitude,
          priority: false,
          status: "waiting",
          createdAt: new Date()
        });

        if (nearbyDrivers.length === 0) {
          return null;
        }

        const destinationNode = randomGraphNodeDifferentFrom(nearestGraphNode({ lat: customer.latitude, lng: customer.longitude }));
        const destination = CITY_NODES[destinationNode];

        return {
          customer,
          destination
        };
      })
      .filter((entry): entry is { customer: { id: number; name: string; latitude: number; longitude: number }; destination: { lat: number; lng: number } } => !!entry)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(batchSize, availableDrivers.length));

    for (const entry of candidateRequests) {
      const request = await prisma.rideRequest.create({
        data: {
          passengerLat: entry.customer.latitude,
          passengerLng: entry.customer.longitude,
          destinationLat: entry.destination.lat,
          destinationLng: entry.destination.lng,
          priority: false,
          status: "waiting"
        }
      });

      this.io.emit("customer:request_created", {
        customerId: entry.customer.id,
        customerName: entry.customer.name,
        requestId: request.id,
        passengerLat: request.passengerLat,
        passengerLng: request.passengerLng,
        destinationLat: request.destinationLat,
        destinationLng: request.destinationLng
      });

      await this.enqueueRequest(request.id);
    }
  }

  private async simulateDriverJourney(rideId: number, path: string[], driverId: number): Promise<void> {
    await prisma.ride.update({
      where: { id: rideId },
      data: { status: "to_pickup" }
    });

    for (const node of path) {
      const coords = CITY_NODES[node];
      await prisma.driver.update({
        where: { id: driverId },
        data: {
          latitude: coords.lat,
          longitude: coords.lng
        }
      });

      this.io.emit("driver:moved", {
        driverId,
        node,
        latitude: coords.lat,
        longitude: coords.lng
      });

      await delay(1000);
    }

    await prisma.ride.update({
      where: { id: rideId },
      data: { status: "picked_up", startTime: new Date() }
    });

    this.io.emit("ride:picked_up", { rideId, driverId });

    const rideWithDestination = await prisma.ride.findUnique({
      where: { id: rideId },
      include: { request: true }
    });

    if (rideWithDestination) {
      const pickupNode = nearestGraphNode({
        lat: rideWithDestination.request.passengerLat,
        lng: rideWithDestination.request.passengerLng
      });
      const destinationNode = nearestGraphNode({
        lat: rideWithDestination.request.destinationLat,
        lng: rideWithDestination.request.destinationLng
      });
      const destinationPath = dijkstra(cityGraph, pickupNode, destinationNode).path;

      if (destinationPath.length > 0) {
        await prisma.ride.update({
          where: { id: rideId },
          data: { status: "to_destination" }
        });

        for (const node of destinationPath) {
          const coords = CITY_NODES[node];
          await prisma.driver.update({
            where: { id: driverId },
            data: {
              latitude: coords.lat,
              longitude: coords.lng
            }
          });

          this.io.emit("driver:moved", {
            driverId,
            node,
            latitude: coords.lat,
            longitude: coords.lng,
            phase: "to_destination"
          });

          await delay(1000);
        }
      }
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const ride = await tx.ride.findUnique({
        where: { id: rideId },
        include: { request: true, driver: true }
      });

      if (!ride) {
        return;
      }

      const rideDistance = haversineDistanceKm(
        { lat: ride.request.passengerLat, lng: ride.request.passengerLng },
        { lat: ride.request.destinationLat, lng: ride.request.destinationLng }
      );

      await tx.driver.update({
        where: { id: driverId },
        data: {
          status: "available",
          latitude: ride.request.destinationLat,
          longitude: ride.request.destinationLng
        }
      });

      await tx.rideRequest.update({
        where: { id: ride.requestId },
        data: { status: "completed" }
      });

      await tx.ride.update({
        where: { id: rideId },
        data: {
          status: "completed",
          endTime: new Date(),
          distance: Number((ride.distance + rideDistance).toFixed(2))
        }
      });
    });

    this.io.emit("ride:completed", { rideId, driverId });
    await this.processQueue();
  }
}

function randomGraphNodeDifferentFrom(node: string): string {
  const keys = Object.keys(CITY_NODES).filter((key) => key !== node);
  return keys[Math.floor(Math.random() * keys.length)] ?? node;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
