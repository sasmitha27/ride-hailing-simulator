# Ride-Hailing Driver Matching Simulator

A web-based simulation demonstrating how a ride-hailing system matches passengers to drivers using classic data structures and algorithms.

---

## Quick overview

- Backend: Node.js + Express + Socket.io (TypeScript)
- Frontend: React + TypeScript + Vite
- Database: PostgreSQL via Prisma
- Purpose: simulate ride requests, match drivers, and stream driver movement in real time.

---

## Key algorithms and data structures

- **Weighted Graph** (`backend/src/algorithms/Graph.ts`) — adjacency list storing neighbor edges with weights.
- **Dijkstra's shortest path** (`backend/src/algorithms/dijkstra.ts`) — finds shortest route between graph nodes; used to estimate driving distance along the city graph.
- **Haversine distance & ETA** (`backend/src/algorithms/geo.ts`) — computes great-circle distance and converts to ETA using average speed.
- **Priority Queue** (`backend/src/queue/PriorityQueue.ts`) — simple array-based priority queue used by Dijkstra and the request manager.
- **FIFO Queue** (`backend/src/queue/Queue.ts`) — standard queue for normal requests.
- **RideRequestManager** (`backend/src/queue/RideRequestManager.ts`) — combines priority + normal queues so priority requests are served first.
- **Matching (Greedy)** (`backend/src/services/MatchingService.ts`) — filters nearby drivers using haversine distance, scores drivers using:

  driver_score = route_distance_km + estimated_arrival_minutes

  and picks the lowest score (greedy choice).

---

## How the simulation works (high level)

1. A passenger creates a ride request (API or auto-generator).
2. Request is enqueued via `RideRequestManager` (priority requests first).
3. The `SimulationEngine` processes the queue, finds available drivers, and calls `MatchingService`.
4. `MatchingService` filters drivers by radius, computes shortest path with Dijkstra, estimates ETA, scores drivers and returns the best candidate.
5. Driver is assigned (status -> `busy`) and `SimulationEngine` simulates movement along the graph path, emitting events over Socket.io: `ride:assigned`, `driver:moved`, `ride:picked_up`, `ride:completed`.
6. On completion, the ride and driver states are updated in the DB and the queue is reprocessed.

---

## Important files (quick links)

- `backend/src/algorithms/dijkstra.ts`
- `backend/src/algorithms/Graph.ts`
- `backend/src/algorithms/cityGraph.ts`
- `backend/src/algorithms/geo.ts`
- `backend/src/services/MatchingService.ts`
- `backend/src/services/SimulationEngine.ts`
- `backend/src/queue/PriorityQueue.ts`
- `backend/src/queue/Queue.ts`
- `backend/src/queue/RideRequestManager.ts`

---

## Getting started (development)

Prerequisites:
- Node.js 18+
- PostgreSQL 14+

1. Install project dependencies (from repository root):

```bash
npm install
```

2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env to set DATABASE_URL and optional settings
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Environment variables used by the simulator (examples in `backend/.env`):

- `DATABASE_URL` — Postgres connection string
- `AVERAGE_SPEED_KMH` — average driver speed for ETA (default 30)
- `DRIVER_SEARCH_RADIUS_KM` — search radius for nearby drivers (default 5)
- `AUTO_REQUEST_BATCH_SIZE`, `AUTO_REQUEST_INTERVAL_MS` — auto request generator settings

3. Frontend setup (from repository root):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and ensure backend is running (default: `http://localhost:4000`).

---

## Runtime events (Socket.io)

- `simulation:state` — full snapshot of simulation
- `queue:updated` — current queue contents
- `ride:assigned` — a ride was assigned to a driver
- `driver:moved` — driver position update
- `ride:picked_up` — passenger picked up
- `ride:completed` — ride completed

---

## Notes, limitations & suggestions

- The graph is a simplified city graph (`backend/src/algorithms/cityGraph.ts`) with a small set of nodes used for demonstration; Dijkstra runs on this graph rather than on raw lat/lng.
- Matching is **greedy** (locally optimal) and may not be globally optimal for fleet-wide objectives — consider a global assignment (Hungarian algorithm / min-cost flow) for production.
- Priority queue implementation is array-based and acceptable for small sizes; switch to a binary heap for better performance on larger graphs/queues.

---

If you'd like, I can:

- Add a short section explaining algorithmic complexity for each algorithm.
- Produce a diagram of the simulation flow.
- Add quick `curl` examples for key API endpoints.

Enjoy exploring the simulator!

```bash
npm run dev:frontend
```

Open `http://localhost:5173`.

## Real-Time Event Channels (Socket.io)

- `simulation:state`
- `queue:updated`
- `ride:assigned`
- `driver:moved`
- `ride:picked_up`
- `ride:completed`

## Visual Legend

- Blue circular car icon: Driver
- Green marker: Passenger pickup
- Red marker: Destination

## Example Dataset

- JSON dataset: `backend/src/data/example-dataset.json`
- Prisma seed script: `backend/src/data/seed.ts`

## Academic Presentation Notes

This project can be demonstrated as:

- Queueing behavior under normal and VIP load
- Graph shortest path effect on ETA
- Greedy driver selection tradeoffs
- Real-time simulation of system state transitions

To highlight algorithmic behavior, submit multiple normal requests, then add a VIP request and observe immediate queue precedence and assignment.
>>>>>>> cd3e93e (first commit)
