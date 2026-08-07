import type { AiAction } from "./action";
import type { AiActionResult } from "./action-result";
import { ActionRegistry } from "./action-registry";

export async function executeAction(
  action: AiAction,
  registry: ActionRegistry,
): Promise<AiActionResult> {
  const handler = registry.resolve(action.type);

  if (!handler) {
    return {
      success: false,
      message: `No handler registered for ${action.type}.`,
    };
  }

  return handler.execute();
}