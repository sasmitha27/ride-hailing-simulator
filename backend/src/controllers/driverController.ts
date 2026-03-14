import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function addDriver(req: Request, res: Response): Promise<void> {
  const { name, latitude, longitude, rating } = req.body;

  if (!name || typeof latitude !== "number" || typeof longitude !== "number") {
    res.status(400).json({ message: "name, latitude and longitude are required" });
    return;
  }

  const driver = await prisma.driver.create({
    data: {
      name,
      latitude,
      longitude,
      rating: typeof rating === "number" ? rating : 4.5,
      status: "available"
    }
  });

  res.status(201).json(driver);
}

export async function listDrivers(_req: Request, res: Response): Promise<void> {
  const drivers = await prisma.driver.findMany({ orderBy: { id: "asc" } });
  res.json(drivers);
}
