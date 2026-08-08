import type { ConversationIntent } from "@/lib/services/ai/conversation/conversation-intent";
import type { CopilotTopic } from "@/lib/services/copilot/copilot-question-router";

import type { AiAction } from "./action";

export function buildActionPlan(
  intent: ConversationIntent,
  topic: CopilotTopic,
): AiAction {
  if (intent !== "ACTION") {
    return {
      type: "NONE",
      executor: null,
      confidence: 100,
      explanation: "No executable action required.",
    };
  }

  switch (topic) {
    case "INVOICES":
      return {
        type: "DRAFT_EMAIL",
        executor: "EMAIL",
        confidence: 95,
        explanation: "The user is requesting an action related to invoices.",
      };

    case "BOOKINGS":
      return {
        type: "CREATE_BOOKING",
        executor: "BOOKING",
        confidence: 95,
        explanation: "The user is requesting a booking action.",
      };

    case "PROJECTS":
      return {
        type: "UPDATE_PROJECT",
        executor: "PROJECT",
        confidence: 90,
        explanation: "The user is requesting a project update.",
      };

    default:
      return {
        type: "CREATE_TASK",
        executor: "TASK",
        confidence: 75,
        explanation:
          "The user requested an action but no specialized executor was selected.",
      };
  }
}
