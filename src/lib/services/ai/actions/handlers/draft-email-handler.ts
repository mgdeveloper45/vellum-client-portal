import type { AiActionHandler } from "../action-handler";
import type { AiActionResult } from "../action-result";

export interface DraftEmailHandlerDependencies {
  draft: () => Promise<string>;
}

export class DraftEmailHandler implements AiActionHandler {
  constructor(private readonly dependencies: DraftEmailHandlerDependencies) {}

  async execute(): Promise<AiActionResult> {
    const email = await this.dependencies.draft();

    return {
      success: true,
      message: email,
    };
  }
}
