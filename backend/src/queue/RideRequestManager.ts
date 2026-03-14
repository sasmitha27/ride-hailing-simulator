import { RideRequest } from "../types/models";
import { PriorityQueue } from "./PriorityQueue";
import { Queue } from "./Queue";

export class RideRequestManager {
  private normalQueue = new Queue<RideRequest>();
  private priorityQueue = new PriorityQueue<RideRequest>();

  enqueue(request: RideRequest): void {
    if (request.priority) {
      this.priorityQueue.enqueue(request, 0);
      return;
    }

    this.normalQueue.enqueue(request);
  }

  dequeue(): RideRequest | undefined {
    if (this.priorityQueue.size() > 0) {
      return this.priorityQueue.dequeue();
    }

    return this.normalQueue.dequeue();
  }

  peek(): RideRequest | undefined {
    return this.priorityQueue.peek() ?? this.normalQueue.peek();
  }

  isEmpty(): boolean {
    return this.priorityQueue.size() + this.normalQueue.size() === 0;
  }

  toArray(): RideRequest[] {
    return [...this.priorityQueue.toArray(), ...this.normalQueue.toArray()];
  }
}
