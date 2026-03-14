export interface GraphEdge {
  to: string;
  weight: number;
}

export class WeightedGraph {
  private adjacency = new Map<string, GraphEdge[]>();

  addNode(node: string): void {
    if (!this.adjacency.has(node)) {
      this.adjacency.set(node, []);
    }
  }

  addEdge(from: string, to: string, weight: number): void {
    this.addNode(from);
    this.addNode(to);
    this.adjacency.get(from)?.push({ to, weight });
    this.adjacency.get(to)?.push({ to: from, weight });
  }

  neighbors(node: string): GraphEdge[] {
    return this.adjacency.get(node) ?? [];
  }

  nodes(): string[] {
    return [...this.adjacency.keys()];
  }
}
