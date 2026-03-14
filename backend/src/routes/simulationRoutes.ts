import { Router } from "express";
import { createSimulationController } from "../controllers/simulationController";
import { SimulationEngine } from "../services/SimulationEngine";

export function simulationRouter(engine: SimulationEngine): Router {
  const router = Router();
  const controller = createSimulationController(engine);

  router.get("/state", controller.state);
  router.post("/process", controller.processQueue);

  return router;
}
