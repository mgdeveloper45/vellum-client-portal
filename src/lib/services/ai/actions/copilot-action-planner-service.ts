import { classifyConversationIntent } from "@/lib/services/ai/conversation/conversation-intent";
import { routeCopilotQuestion } from "@/lib/services/copilot/copilot-question-router";

import { buildActionConfirmation } from "./action-confirmation";
import { buildActionPlan } from "./action-planner";
import type { AiActionType } from "./action";

export interface CopilotActionPlanResult {
  handled: boolean;
  action: AiActionType;
  message: string;
  requiresConfirmation: boolean;
}

export function planCopilotAction(question: string): CopilotActionPlanResult {
  const intent = classifyConversationIntent(question);
  const topic = routeCopilotQuestion(question);

  const action = buildActionPlan(intent, topic.topic);

  if (action.type === "NONE") {
    return {
      handled: false,
      action: "NONE",
      message: "",
      requiresConfirmation: false,
    };
  }

  const confirmation = buildActionConfirmation(action.type);

  return {
    handled: true,
    action: confirmation.action,
    message: confirmation.message,
    requiresConfirmation: confirmation.requiresConfirmation,
  };
}
