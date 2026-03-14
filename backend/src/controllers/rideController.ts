import { Request, Response } from "express";
import { prisma } from "../prisma";

function durationSeconds(start: Date | null, end: Date | null): number | null {
  if (!start) return null;
  const endTime = end ?? new Date();
  return Math.max(0, Math.round((endTime.getTime() - start.getTime()) / 1000));
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
    const customer = customers.find(
      (c: any) =>
        Math.abs(c.latitude - ride.request.passengerLat) < 0.0002 &&
        Math.abs(c.longitude - ride.request.passengerLng) < 0.0002
    );

    const arrivalToCustomerSeconds = ride.startTime
      ? Math.max(0, Math.round((ride.startTime.getTime() - ride.request.createdAt.getTime()) / 1000))
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
      pickup: {
        lat: ride.request.passengerLat,
        lng: ride.request.passengerLng
      },
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
