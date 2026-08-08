import type { AiActionHandler } from "./action-handler";
import { ActionRegistry } from "./action-registry";

export interface ActionRegistryHandlers {
  draftEmail?: AiActionHandler;
  createTask?: AiActionHandler;
  createBooking?: AiActionHandler;
  updateProject?: AiActionHandler;
}

export function createActionRegistry(
  handlers: ActionRegistryHandlers = {},
): ActionRegistry {
  const registry = new ActionRegistry();

  if (handlers.draftEmail) {
    registry.register("EMAIL", handlers.draftEmail);
  }

  if (handlers.createTask) {
    registry.register("TASK", handlers.createTask);
  }

  if (handlers.createBooking) {
    registry.register("BOOKING", handlers.createBooking);
  }

  if (handlers.updateProject) {
    registry.register("PROJECT", handlers.updateProject);
  }

  return registry;
}