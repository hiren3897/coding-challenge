import type { BaseEvent, EventType, Listener } from "../types/EventBus";


interface ListenerEntry<T> {
  listener: Listener<T>;
  priority: number;
}

export class EventBus {
    // TODO: improvement of any type we can use unknown then we have to use typegaurds for the expected type
    private listeners: Map<EventType, ListenerEntry<any>[]> = new Map(); // used Map to easily find the event from the pool
    private defaultPriority = 0; 

    register<T>(
        type: EventType,
        listener: Listener<T>,
        priority: number = this.defaultPriority
    ): void {
        // check if the listener type already exist
        if (!this.listeners.has(type)) {
            // removing the listener
            this.listeners.set(type, []);
        }
        const entries = this.listeners.get(type)!;
        const existing = entries.find(entry => entry.listener === listener);
        if (existing) return;

        entries.push({ listener, priority });
        entries.sort((a, b) => b.priority - a.priority); // Assuming: descending priority
    }

    unregister<T>(type: EventType, listener: Listener<T>): void {
        const entries = this.listeners.get(type);
        if (entries) {
            this.listeners.set(
                type,
                entries.filter(entry => entry.listener !== listener)
            );
        }
    }

    post<T>(event: BaseEvent<T>): void {
        const entries = this.listeners.get(event.type);
        if (!entries) return;
        
        for (const entry of entries) {
            entry.listener(event);
        }
    }
}