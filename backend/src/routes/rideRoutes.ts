import { Router } from "express";
import { listRides } from "../controllers/rideController";

export const rideRouter = Router();
rideRouter.get("/", listRides);
