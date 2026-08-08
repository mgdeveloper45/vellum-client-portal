import type { ConversationIntent } from "@/lib/services/ai/conversation/conversation-intent";
import type { CopilotTopic } from "@/lib/services/copilot/copilot-question-router";

import type { ToolPlan } from "./tool-plan";

export function buildToolPlan(
  intent: ConversationIntent,
  topic: CopilotTopic,
): ToolPlan {
  if (intent !== "ACTION") {
    return {
      tool: null,
      requiresConfirmation: false,
    };
  }

  switch (topic) {
    case "INVOICES":
      return {
        tool: "DRAFT_EMAIL",
        requiresConfirmation: false,
      };

    case "BOOKINGS":
      return {
        tool: "CREATE_BOOKING",
        requiresConfirmation: true,
      };

    case "PROJECTS":
      return {
        tool: "UPDATE_PROJECT",
        requiresConfirmation: true,
      };

    default:
      return {
        tool: "CREATE_TASK",
        requiresConfirmation: true,
      };
  }
}
