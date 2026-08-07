import type { AiActionHandler } from "./action-handler";
import { ActionRegistry } from "./action-registry";

export interface ActionRegistryHandlers {
  draftEmail?: AiActionHandler;
  createTask?: AiActionHandler;
  createBooking?: AiActionHandler;
  updateProject?: AiActionHandler;
  createInvoice?: AiActionHandler;
}

export function createActionRegistry(
  handlers: ActionRegistryHandlers = {},
): ActionRegistry {
  const registry = new ActionRegistry();

  if (handlers.draftEmail) {
    registry.register("DRAFT_EMAIL", handlers.draftEmail);
  }

  if (handlers.createTask) {
    registry.register("CREATE_TASK", handlers.createTask);
  }

  if (handlers.createBooking) {
    registry.register("CREATE_BOOKING", handlers.createBooking);
  }

  if (handlers.updateProject) {
    registry.register("UPDATE_PROJECT", handlers.updateProject);
  }

  if (handlers.createInvoice) {
    registry.register("CREATE_INVOICE", handlers.createInvoice);
  }

  return registry;
}
