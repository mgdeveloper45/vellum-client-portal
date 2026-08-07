import type { AiActionResult } from "./action-result";

export interface AiActionHandler {
  execute(): Promise<AiActionResult>;
}
