import { classifyConversationIntent } from "@/lib/services/ai/conversation/conversation-intent";
import { routeCopilotQuestion } from "@/lib/services/copilot/copilot-question-router";

import { buildActionPlan } from "./action-planner";
import { getActionPolicy } from "./action-policy";
import { executeAction } from "./action-executor";
import { ActionRegistry } from "./action-registry";
import type { AiActionResult } from "./action-result";

export async function orchestrateAction(
  question: string,
  registry: ActionRegistry,
): Promise<AiActionResult> {
  const intent = classifyConversationIntent(question);

  const topic = routeCopilotQuestion(question);

  const action = buildActionPlan(intent, topic.topic);

  const policy = getActionPolicy(action.type);

  if (policy === "CONFIRMATION_REQUIRED") {
    return {
      success: false,
      message: `Confirmation required before executing ${action.type}.`,
    };
  }

  return executeAction(action, registry);
}
