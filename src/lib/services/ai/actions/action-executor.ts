import type { AiAction } from "./action";
import type { AiActionResult } from "./action-result";
import { ActionRegistry } from "./action-registry";

export async function executeAction(
  action: AiAction,
  registry: ActionRegistry,
): Promise<AiActionResult> {
  if (!action.executor) {
    return {
      success: false,
      message: "No executable action was planned.",
    };
  }

  const handler = registry.resolve(action.executor);

  if (!handler) {
    return {
      success: false,
      message: `No handler registered for ${action.executor}.`,
    };
  }

  return handler.execute();
}