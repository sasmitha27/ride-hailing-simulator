import assert from "node:assert/strict";
import test from "node:test";
import { WeightedGraph } from "../algorithms/Graph";
import { dijkstra } from "../algorithms/dijkstra";
import { RideRequestManager } from "../queue/RideRequestManager";
import { PriorityQueue } from "../queue/PriorityQueue";
import { MatchingService } from "../services/MatchingService";
import { Driver, RideRequest } from "../types/models";

function request(id: number, priority = false): RideRequest {
  return {
    id,
    passengerLat: 6.9271,
    passengerLng: 79.8612,
    destinationLat: 6.9447,
    destinationLng: 79.8599,
    priority,
    status: "waiting",
    createdAt: new Date(id * 1000)
  };
}

test("Dijkstra returns the lowest-cost path", () => {
  const graph = new WeightedGraph();
  graph.addEdge("A", "B", 8);
  graph.addEdge("A", "C", 2);
  graph.addEdge("C", "B", 1);

  assert.deepEqual(dijkstra(graph, "A", "B"), {
    distance: 3,
    path: ["A", "C", "B"]
  });
});

test("hybrid request manager serves priority first and keeps FIFO order", () => {
  const manager = new RideRequestManager();
  manager.enqueue(request(1));
  manager.enqueue(request(2, true));
  manager.enqueue(request(3));
  manager.enqueue(request(4, true));

  assert.deepEqual(manager.toArray().map(({ id }) => id), [2, 4, 1, 3]);
  assert.deepEqual(
    [manager.dequeue(), manager.dequeue(), manager.dequeue(), manager.dequeue()].map((item) => item?.id),
    [2, 4, 1, 3]
  );
});

test("binary heap orders priorities and remains stable for equal values", () => {
  const queue = new PriorityQueue<string>();
  queue.enqueue("later", 5);
  queue.enqueue("first equal", 1);
  queue.enqueue("middle", 3);
  queue.enqueue("second equal", 1);

  assert.deepEqual(queue.toArray(), ["first equal", "second equal", "middle", "later"]);
  assert.deepEqual(
    [queue.dequeue(), queue.dequeue(), queue.dequeue(), queue.dequeue()],
    ["first equal", "second equal", "middle", "later"]
  );
});

test("matching includes off-graph distance and prefers the true nearer driver", () => {
  const matcher = new MatchingService(30, 5);
  const drivers: Driver[] = [
    { id: 1, name: "At node", latitude: 6.9271, longitude: 79.8612, status: "available", rating: 4.5 },
    { id: 2, name: "Near node", latitude: 6.9285, longitude: 79.8612, status: "available", rating: 5 }
  ];

  const scored = matcher.scoreDrivers(drivers, request(1));

  assert.equal(scored[0].driver.id, 1);
  assert.ok(scored[1].routeDistanceKm > scored[0].routeDistanceKm);
});

test("matching uses rating and ID as deterministic ETA tie-breakers", () => {
  const matcher = new MatchingService(30, 5);
  const drivers: Driver[] = [
    { id: 3, name: "Lower rated", latitude: 6.9271, longitude: 79.8612, status: "available", rating: 4.2 },
    { id: 2, name: "Higher rated", latitude: 6.9271, longitude: 79.8612, status: "available", rating: 4.9 }
  ];

  assert.equal(matcher.scoreDrivers(drivers, request(1))[0].driver.id, 2);
});
