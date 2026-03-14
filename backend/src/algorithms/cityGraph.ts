import { Coordinates } from "../types/models";
import { WeightedGraph } from "./Graph";
import { haversineDistanceKm } from "./geo";

export const CITY_NODES: Record<string, Coordinates> = {
  A: { lat: 6.9271, lng: 79.8612 },
  B: { lat: 6.9312, lng: 79.8478 },
  C: { lat: 6.9147, lng: 79.8560 },
  D: { lat: 6.9363, lng: 79.8757 },
  E: { lat: 6.9058, lng: 79.8790 },
  F: { lat: 6.9447, lng: 79.8599 },
  G: { lat: 6.9203, lng: 79.8402 },
  H: { lat: 6.8995, lng: 79.8516 }
};

const ROAD_CONNECTIONS: Array<[string, string]> = [
  ["A", "B"], ["A", "C"], ["A", "D"],
  ["B", "G"], ["B", "C"],
  ["C", "H"], ["C", "E"],
  ["D", "F"], ["D", "E"],
  ["E", "H"], ["F", "B"], ["G", "H"]
];

export function buildCityGraph(): WeightedGraph {
  const graph = new WeightedGraph();

  for (const [from, to] of ROAD_CONNECTIONS) {
    const weight = haversineDistanceKm(CITY_NODES[from], CITY_NODES[to]);
    graph.addEdge(from, to, Number(weight.toFixed(3)));
  }

  return graph;
}

export function nearestGraphNode(point: Coordinates): string {
  let bestNode = "A";
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [node, coords] of Object.entries(CITY_NODES)) {
    const distance = haversineDistanceKm(point, coords);
    if (distance < bestDistance) {
      bestNode = node;
      bestDistance = distance;
    }
  }

  return bestNode;
}
