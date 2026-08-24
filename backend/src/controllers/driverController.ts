import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function addDriver(req: Request, res: Response): Promise<void> {
  const { name, latitude, longitude, rating } = req.body;

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    !isValidCoordinates(latitude, longitude)
  ) {
    res.status(400).json({ message: "name, latitude and longitude are required" });
    return;
  }

  if (rating !== undefined && (typeof rating !== "number" || rating < 1 || rating > 5)) {
    res.status(400).json({ message: "rating must be a number from 1 to 5" });
    return;
  }

  const driver = await prisma.driver.create({
    data: {
      name: name.trim(),
      latitude,
      longitude,
      rating: typeof rating === "number" ? rating : 4.5,
      status: "available"
    }
  });

  res.status(201).json(driver);
}

function isValidCoordinates(latitude: unknown, longitude: unknown): boolean {
  return typeof latitude === "number" && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
    typeof longitude === "number" && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

export async function listDrivers(_req: Request, res: Response): Promise<void> {
  const drivers = await prisma.driver.findMany({ orderBy: { id: "asc" } });
  res.json(drivers);
}
