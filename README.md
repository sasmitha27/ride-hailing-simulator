# Ride-Hailing Driver Matching Simulator

A full-stack simulation of a ride-hailing platform that demonstrates how data structures and algorithms are used to match passengers to drivers in real time.

This project is especially suitable for coursework demonstrations because it clearly shows:
- queueing and prioritization of requests,
- shortest-path routing over a city graph,
- greedy assignment decisions,
- live event-driven state updates on a map.

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, Socket.io
- Frontend: React, TypeScript, Vite, React-Leaflet
- Database: PostgreSQL

## Features

- Real-time simulation dashboard with map-based visualization
- Driver and ride request management APIs
- Priority request handling (VIP/urgent requests are served first)
- Automatic customer request generation
- Random background movement for available drivers (to simulate realistic dynamics)
- Driver-to-passenger and passenger-to-destination movement animation
- Live event stream using Socket.io
- Validation rule: reject rides where pickup and destination are too close

## Algorithms Used

### 1) Dijkstra's Shortest Path Algorithm
Used to find the shortest route across a weighted city graph.

Where it is used:
- Driver -> passenger routing
- Passenger pickup -> destination routing

Why it is useful:
- Produces realistic route-based distance instead of pure straight-line distance.

### 2) Greedy Matching Strategy
After scoring candidate drivers, the system immediately selects the best current option.

Scoring formula used:

score = routeDistanceKm + etaMinutes

Where:
- routeDistanceKm is computed from shortest path on graph
- etaMinutes is derived from route distance and average speed

Why it is useful:
- Fast and practical for real-time dispatch decisions.

### 3) Haversine Distance
Used for geographic (great-circle) distance between latitude/longitude coordinates.

Where it is used:
- Filtering nearby drivers within a search radius
- Ride validation constraints
- Final ride distance estimation

## Data Structures Used

### 1) Weighted Graph (Adjacency List)
Represents city nodes and weighted edges.

- Efficient neighbor lookup for shortest-path calculations
- Supports bidirectional edges with travel weights

### 2) Priority Queue
Used in two places:
- Dijkstra frontier (lowest known cost first)
- Priority ride requests (VIP requests dequeued before normal)

Current implementation detail:
- Array-based priority insertion (sufficient for coursework-scale simulation)

### 3) FIFO Queue
Stores normal ride requests in arrival order.

Why it is useful:
- Fair processing for non-priority requests.

### 4) Hybrid Queue Manager
A custom RideRequestManager combines:
- priority queue + normal queue

Behavior:
- Serve all priority requests first
- Then continue FIFO for normal requests

## Useful New/Advanced Implementation Features

These are practical enhancements beyond a basic CRUD demo:

1. Real-time Event-Driven Architecture
- The backend emits live events such as:
  - simulation:state
  - queue:updated
  - ride:assigned
  - driver:moved
  - ride:picked_up
  - ride:completed
- Frontend subscribes and updates UI immediately without manual refresh.

2. Queue Hold + Batch Processing Behavior
- A configurable delay before queue processing helps gather incoming requests.
- Improves simulation realism and demonstrates scheduling behavior.

3. Automatic Request Generator
- Periodically creates requests from seeded customers.
- Useful for stress-testing matching logic without manual input.

4. Background Driver Drift
- Available drivers move slightly over time.
- Demonstrates how dynamic positions affect assignment outcomes.

5. Safety Validation for Ride Requests
- Rejects requests below minimum pickup-destination distance.
- Prevents meaningless test data and improves simulation quality.

6. Configurable Simulation Parameters
- Key behavior can be tuned using environment variables (speed, radius, intervals, animation timings).
- Useful for experimentation and performance demonstrations in lectures.

## Project Structure (Main Parts)

- backend/: API server, matching logic, queueing, simulation engine, Prisma
- frontend/: React simulator UI and map visualization
- backend/src/algorithms/: graph, Dijkstra, geo utilities
- backend/src/queue/: queue data structures and request manager
- backend/src/services/: matching and simulation orchestration

## How to Run (Local Development)

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+

### 1) Install Dependencies

From project root:

```bash
npm install
npm run install:all
```

### 2) Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit backend/.env if needed:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ride_hailing_simulator?schema=public"
PORT=4000
AVERAGE_SPEED_KMH=30
DRIVER_SEARCH_RADIUS_KM=5
```

Optional advanced tuning variables supported by the simulator engine:

```env
AUTO_REQUEST_BATCH_SIZE=2
AUTO_REQUEST_INTERVAL_MS=10000
QUEUE_HOLD_BEFORE_PROCESSING_MS=3000
DRIVER_ANIMATION_MIN_MS=10000
DRIVER_ANIMATION_MAX_MS=25000
```

### 3) Initialize Database

From backend directory:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

### 4) Start Backend

From project root:

```bash
npm run dev:backend
```

Backend runs at:
- http://localhost:4000

### 5) Start Frontend

In another terminal from project root:

```bash
npm run dev:frontend
```

Frontend runs at:
- http://localhost:5173

## Core API Endpoints

- GET /health
- GET /drivers
- POST /drivers
- GET /customers
- GET /rides
- GET /requests
- POST /requests
- GET /simulation/state
- POST /simulation/process

## Demo Flow for Lecture

1. Start backend + frontend.
2. Open simulator dashboard in browser.
3. Add a few normal requests.
4. Add a priority request and show queue precedence.
5. Explain shortest-path and greedy score during assignment.
6. Show live driver movement and ride lifecycle events.
7. Discuss trade-off: greedy local optimum vs global optimization.

## Academic Notes (Complexity Discussion)

- Dijkstra with current array-priority queue behaves approximately O(V^2 + E) in this implementation context.
- A binary-heap priority queue could improve asymptotic performance for larger graphs.
- Current design is intentionally readable and demonstrable for coursework.

## Future Improvements

- Replace array priority queue with binary heap
- Add global assignment optimization (Hungarian / min-cost flow)
- Add surge-pricing or driver rating weight into score
- Add simulation replay + analytics charts

## License

For educational/coursework use.
