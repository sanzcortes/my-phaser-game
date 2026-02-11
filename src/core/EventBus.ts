export class EventBus {
  private static instance: EventBus;
  private eventMap: Map<string, Function[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on(event: string, callback: Function): void {
    const callbacks = this.eventMap.get(event) || [];
    callbacks.push(callback);
    this.eventMap.set(event, callbacks);
  }

  public off(event: string, callback: Function): void {
    const callbacks = this.eventMap.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  public emit(event: string, ...args: any[]): void {
    const callbacks = this.eventMap.get(event) || [];
    callbacks.forEach(callback => callback(...args));
  }

  public clear(): void {
    this.eventMap.clear();
  }

  public hasListeners(event: string): boolean {
    const callbacks = this.eventMap.get(event) || [];
    return callbacks.length > 0;
  }
}