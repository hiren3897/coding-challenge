export type EventType = string;

export interface BaseEvent<T> {
  type: EventType;
  timestamp: number;
  data: T;
}

export type Listener<T> = (event: BaseEvent<T>) => void;