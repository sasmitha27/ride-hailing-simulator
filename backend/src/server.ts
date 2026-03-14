import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./prisma";
import { driverRouter } from "./routes/driverRoutes";
import { customerRouter } from "./routes/customerRoutes";
import { rideRouter } from "./routes/rideRoutes";
import { requestRouter } from "./routes/requestRoutes";
import { simulationRouter } from "./routes/simulationRoutes";
import { SimulationEngine } from "./services/SimulationEngine";

const port = Number(process.env.PORT ?? 4000);

async function bootstrap(): Promise<void> {
  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: "*" }
  });

  const engine = new SimulationEngine(io);
  await engine.bootstrapQueues();
  engine.startRandomDriverMovement(5, 2000);
  engine.startAutomaticCustomerRequests(3, 12000);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/drivers", driverRouter);
  app.use("/customers", customerRouter);
  app.use("/rides", rideRouter);
  app.use("/requests", requestRouter(engine));
  app.use("/simulation", simulationRouter(engine));

  io.on("connection", async (socket) => {
    const state = await engine.getSimulationState();
    socket.emit("simulation:state", state);
  });

  server.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

bootstrap()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
