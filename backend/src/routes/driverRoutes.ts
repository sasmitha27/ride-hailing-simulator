import { Router } from "express";
import { addDriver, listDrivers } from "../controllers/driverController";

export const driverRouter = Router();

driverRouter.get("/", listDrivers);
driverRouter.post("/", addDriver);
