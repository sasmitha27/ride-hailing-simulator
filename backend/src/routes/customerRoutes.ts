import { Router } from "express";
import { listCustomers } from "../controllers/customerController";

export const customerRouter = Router();
customerRouter.get("/", listCustomers);
