import type { DomainEvent } from "./domain-event";

type EventHandler = (event: DomainEvent) => Promise<void>;

const handlers = new Map<string, EventHandler[]>();

export function registerEventHandler(type: string, handler: EventHandler) {
  const existing = handlers.get(type) ?? [];

  existing.push(handler);

  handlers.set(type, existing);
}

export async function publishEvent(event: DomainEvent) {
  const eventHandlers = handlers.get(event.type) ?? [];

  await Promise.all(eventHandlers.map((handler) => handler(event)));
}
