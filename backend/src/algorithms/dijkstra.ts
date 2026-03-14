import { PriorityQueue } from "../queue/PriorityQueue";
import { WeightedGraph } from "./Graph";

export interface PathResult {
  distance: number;
  path: string[];
}

// Dijkstra's algorithm for shortest path on a weighted graph.
export function dijkstra(graph: WeightedGraph, start: string, end: string): PathResult {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const frontier = new PriorityQueue<string>();

  for (const node of graph.nodes()) {
    distances.set(node, Number.POSITIVE_INFINITY);
    previous.set(node, null);
  }

  distances.set(start, 0);
  frontier.enqueue(start, 0);

  while (frontier.size() > 0) {
    const current = frontier.dequeue();
    if (!current) {
      break;
    }

    if (current === end) {
      break;
    }

    const currentDistance = distances.get(current) ?? Number.POSITIVE_INFINITY;

    for (const edge of graph.neighbors(current)) {
      const candidate = currentDistance + edge.weight;
      const knownDistance = distances.get(edge.to) ?? Number.POSITIVE_INFINITY;

      if (candidate < knownDistance) {
        distances.set(edge.to, candidate);
        previous.set(edge.to, current);
        frontier.enqueue(edge.to, candidate);
      }
    }
  }

  const path: string[] = [];
  let pointer: string | null = end;

  while (pointer) {
    path.unshift(pointer);
    pointer = previous.get(pointer) ?? null;
  }

  if (path[0] !== start) {
    return { distance: Number.POSITIVE_INFINITY, path: [] };
  }

  return {
    distance: distances.get(end) ?? Number.POSITIVE_INFINITY,
    path
  };
}
