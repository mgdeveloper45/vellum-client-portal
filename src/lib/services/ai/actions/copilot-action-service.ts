import type { AiActionCard } from "./action-card";
import { buildActionCard } from "./action-card-builder";
import { orchestrateAction } from "./action-orchestrator";
import type { ActionRegistry } from "./action-registry";

export interface CopilotActionResponse {
  handled: boolean;

  message: string;

  card: AiActionCard | null;
}

export async function executeCopilotAction(
  question: string,
  registry: ActionRegistry,
): Promise<CopilotActionResponse> {
  const result = await orchestrateAction(question, registry);

  const card = buildActionCard(result);

  return {
    handled: result.success,
    message: result.message,
    card,
  };
}
