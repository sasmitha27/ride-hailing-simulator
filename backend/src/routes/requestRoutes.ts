import { Router } from "express";
import { createRequestController } from "../controllers/requestController";
import { SimulationEngine } from "../services/SimulationEngine";

export function requestRouter(engine: SimulationEngine): Router {
  const router = Router();
  const controller = createRequestController(engine);

  router.get("/", controller.listRequests);
  router.post("/", controller.addRequest);

  return router;
}
