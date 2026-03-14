import { Request, Response } from "express";
import { prisma } from "../prisma";
import { haversineDistanceKm } from "../algorithms/geo";

function durationSeconds(start: Date | null, end: Date | null): number | null {
  if (!start) return null;
  const endTime = end ?? new Date();
  return Math.max(0, Math.round((endTime.getTime() - start.getTime()) / 1000));
}

function secondsBetween(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 1000));
}

function findNearestCustomer(
  customers: Array<{ id: number; name: string; latitude: number; longitude: number }>,
  pickup: { lat: number; lng: number },
  maxDistanceKm = 0.25
): { id: number; name: string } | null {
  let best: { id: number; name: string } | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const customer of customers) {
    const distanceKm = haversineDistanceKm(
      { lat: customer.latitude, lng: customer.longitude },
      { lat: pickup.lat, lng: pickup.lng }
    );

    if (distanceKm < bestDistance) {
      bestDistance = distanceKm;
      best = { id: customer.id, name: customer.name };
    }
  }

  if (bestDistance > maxDistanceKm) {
    return null;
  }

  return best;
}

export async function listRides(_req: Request, res: Response): Promise<void> {
  const prismaAny = prisma as any;

  const [rides, customers] = await Promise.all([
    prisma.ride.findMany({
      include: {
        driver: true,
        request: true
      },
      orderBy: { id: "desc" }
    }),
    prismaAny.customer ? prismaAny.customer.findMany({ orderBy: { id: "asc" } }) : Promise.resolve([])
  ]);

  const mapped = rides.map((ride: any) => {
    const pickup = {
      lat: ride.request.passengerLat,
      lng: ride.request.passengerLng
    };

    const customer = findNearestCustomer(customers, pickup);

    const arrivalToCustomerSeconds = ride.startTime
      ? secondsBetween(ride.request.createdAt, ride.startTime)
      : ["assigned", "to_pickup"].includes(ride.status)
        ? secondsBetween(ride.request.createdAt, new Date())
        : null;

    const tripDurationSeconds = durationSeconds(ride.startTime, ride.endTime);

    return {
      id: ride.id,
      status: ride.status,
      rider: {
        id: ride.driver.id,
        name: ride.driver.name
      },
      customer: {
        id: customer?.id ?? null,
        name: customer?.name ?? "Unknown"
      },
      pickup,
      destination: {
        lat: ride.request.destinationLat,
        lng: ride.request.destinationLng
      },
      distanceKm: ride.distance,
      tripDurationSeconds,
      arrivalToCustomerSeconds,
      requestedAt: ride.request.createdAt,
      tripStartedAt: ride.startTime,
      tripEndedAt: ride.endTime
    };
  });

  res.json(mapped);
}
