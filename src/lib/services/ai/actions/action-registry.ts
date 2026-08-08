import type { AiActionType } from "./action";
import type { AiActionHandler } from "./action-handler";

export class ActionRegistry {
  private readonly handlers = new Map<AiActionType, AiActionHandler>();

  register(action: AiActionType, handler: AiActionHandler): void {
    this.handlers.set(action, handler);
  }

  resolve(action: AiActionType): AiActionHandler | undefined {
    return this.handlers.get(action);
  }

  require(action: AiActionType): AiActionHandler {
    const handler = this.handlers.get(action);

    if (!handler) {
      throw new Error(`No AI action registered for '${action}'.`);
    }

    return handler;
  }
}
