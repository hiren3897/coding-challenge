import type { BaseEvent, EventType, Listener } from "../types/EventBus";


interface ListenerEntry<T> {
  listener: Listener<T>;
  priority: number;
}

export class EventBus {
    private listeners: Map<EventType, ListenerEntry<any>[]> = new Map(); // TODO improvement 
    private defaultPriority = 0;

    register<T>(
        type: EventType,
        listener: Listener<T>,
        priority: number = this.defaultPriority
    ): void {

    }

    unregister<T>(type: EventType, listener: Listener<T>): void {

    }

    post<T>(event: BaseEvent<T>): void {

    }
}