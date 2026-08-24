interface PriorityItem<T> {
  value: T;
  priority: number;
  sequence: number;
}

export class PriorityQueue<T> {
  private items: PriorityItem<T>[] = [];
  private nextSequence = 0;

  enqueue(value: T, priority: number): void {
    this.items.push({ value, priority, sequence: this.nextSequence++ });
    this.bubbleUp(this.items.length - 1);
  }

  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined;

    const first = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0 && last) {
      this.items[0] = last;
      this.sinkDown(0);
    }

    return first.value;
  }

  peek(): T | undefined {
    return this.items[0]?.value;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items].sort((a, b) => this.compare(a, b)).map((item) => item.value);
  }

  private bubbleUp(index: number): void {
    let childIndex = index;
    while (childIndex > 0) {
      const parentIndex = Math.floor((childIndex - 1) / 2);
      if (this.compare(this.items[parentIndex], this.items[childIndex]) <= 0) break;
      [this.items[parentIndex], this.items[childIndex]] = [this.items[childIndex], this.items[parentIndex]];
      childIndex = parentIndex;
    }
  }

  private sinkDown(index: number): void {
    let parentIndex = index;
    while (true) {
      const left = parentIndex * 2 + 1;
      const right = left + 1;
      let smallest = parentIndex;

      if (left < this.items.length && this.compare(this.items[left], this.items[smallest]) < 0) {
        smallest = left;
      }
      if (right < this.items.length && this.compare(this.items[right], this.items[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === parentIndex) break;

      [this.items[parentIndex], this.items[smallest]] = [this.items[smallest], this.items[parentIndex]];
      parentIndex = smallest;
    }
  }

  private compare(a: PriorityItem<T>, b: PriorityItem<T>): number {
    return a.priority - b.priority || a.sequence - b.sequence;
  }
}
