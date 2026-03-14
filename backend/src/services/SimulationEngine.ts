import { Prisma } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";
import { CITY_NODES } from "../algorithms/cityGraph";
import { haversineDistanceKm } from "../algorithms/geo";
import { prisma } from "../prisma";
import { RideRequestManager } from "../queue/RideRequestManager";
import { MatchingService } from "./MatchingService";

const averageSpeedKmh = Number(process.env.AVERAGE_SPEED_KMH ?? 30);
const searchRadiusKm = Number(process.env.DRIVER_SEARCH_RADIUS_KM ?? 5);

export class SimulationEngine {
  private requestManager = new RideRequestManager();
  private matcher = new MatchingService(averageSpeedKmh, searchRadiusKm);
  private processing = false;

  constructor(private readonly io: SocketIOServer) {}

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

  private async simulateDriverJourney(rideId: number, path: string[], driverId: number): Promise<void> {
    await prisma.ride.update({
      where: { id: rideId },
      data: { startTime: new Date(), status: "to_pickup" }
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
      data: { status: "picked_up" }
    });

    this.io.emit("ride:picked_up", { rideId, driverId });

    await delay(1500);

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
