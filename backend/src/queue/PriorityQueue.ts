interface PriorityItem<T> {
  value: T;
  priority: number;
}

export class PriorityQueue<T> {
  private items: PriorityItem<T>[] = [];

  enqueue(value: T, priority: number): void {
    const item: PriorityItem<T> = { value, priority };
    const inserted = this.items.findIndex((entry) => priority < entry.priority);

    if (inserted === -1) {
      this.items.push(item);
      return;
    }

    this.items.splice(inserted, 0, item);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.value;
  }

  peek(): T | undefined {
    return this.items[0]?.value;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return this.items.map((item) => item.value);
  }
}
