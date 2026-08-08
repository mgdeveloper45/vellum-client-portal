import type { AiActionExecutor } from "./action";
import type { AiActionHandler } from "./action-handler";

export class ActionRegistry {
  private readonly handlers = new Map<AiActionExecutor, AiActionHandler>();

  register(executor: AiActionExecutor, handler: AiActionHandler): void {
    this.handlers.set(executor, handler);
  }

  resolve(executor: AiActionExecutor): AiActionHandler | undefined {
    return this.handlers.get(executor);
  }

  require(executor: AiActionExecutor): AiActionHandler {
    const handler = this.handlers.get(executor);

    if (!handler) {
      throw new Error(`No AI action handler registered for '${executor}'.`);
    }

    return handler;
  }
}
