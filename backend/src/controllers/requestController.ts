import { Request, Response } from "express";
import { prisma } from "../prisma";
import { SimulationEngine } from "../services/SimulationEngine";
import { haversineDistanceKm } from "../algorithms/geo";

const MIN_REQUEST_DISTANCE_KM = 1;

export function createRequestController(engine: SimulationEngine) {
  return {
    addRequest: async (req: Request, res: Response): Promise<void> => {
      const {
        passengerLat,
        passengerLng,
        destinationLat,
        destinationLng,
        priority
      } = req.body;

      if (
        typeof passengerLat !== "number" ||
        typeof passengerLng !== "number" ||
        typeof destinationLat !== "number" ||
        typeof destinationLng !== "number"
      ) {
        res.status(400).json({ message: "Passenger and destination coordinates are required" });
        return;
      }

      const distanceKm = haversineDistanceKm(
        { lat: passengerLat, lng: passengerLng },
        { lat: destinationLat, lng: destinationLng }
      );

      if (distanceKm < MIN_REQUEST_DISTANCE_KM) {
        res.status(400).json({
          message: `Ride rejected: pickup and destination must be at least ${MIN_REQUEST_DISTANCE_KM} km apart.`
        });
        return;
      }

      const request = await prisma.rideRequest.create({
        data: {
          passengerLat,
          passengerLng,
          destinationLat,
          destinationLng,
          priority: Boolean(priority),
          status: "waiting"
        }
      });

      await engine.enqueueRequest(request.id);
      res.status(201).json(request);
    },

    listRequests: async (_req: Request, res: Response): Promise<void> => {
      const requests = await prisma.rideRequest.findMany({ orderBy: { createdAt: "asc" } });
      res.json(requests);
    }
  };
}
