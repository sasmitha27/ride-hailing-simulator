import { Request, Response } from "express";
import { SimulationEngine } from "../services/SimulationEngine";

export function createSimulationController(engine: SimulationEngine) {
  return {
    state: async (_req: Request, res: Response): Promise<void> => {
      const state = await engine.getSimulationState();
      res.json(state);
    },

    processQueue: async (_req: Request, res: Response): Promise<void> => {
      await engine.processQueue();
      res.json({ message: "Queue processing triggered" });
    }
  };
}
