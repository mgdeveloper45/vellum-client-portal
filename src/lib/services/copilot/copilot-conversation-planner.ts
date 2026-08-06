import type { CopilotQuestion } from "./copilot-question-router";
import type { CopilotTopic } from "./copilot-question-router";

export interface ConversationPlan {
  topics: CopilotTopic[];
}

export function buildConversationPlan(
  question: CopilotQuestion,
): ConversationPlan {
  switch (question.topic) {
    case "REVENUE":
      return {
        topics: [
          "REVENUE",
          "INVOICES",
          "RECOMMENDATIONS",
        ],
      };

    case "BOOKINGS":
      return {
        topics: [
          "BOOKINGS",
          "CAPACITY",
        ],
      };

    case "CAPACITY":
      return {
        topics: [
          "CAPACITY",
          "BOOKINGS",
        ],
      };

    case "INVOICES":
      return {
        topics: [
          "INVOICES",
          "REVENUE",
        ],
      };

    case "RISKS":
      return {
        topics: [
          "RISKS",
          "RECOMMENDATIONS",
          "REVENUE",
          "BOOKINGS",
        ],
      };

    case "CLIENTS":
      return {
        topics: [
          "CLIENTS",
          "RECOMMENDATIONS",
        ],
      };

    case "PROJECTS":
      return {
        topics: [
          "PROJECTS",
          "RISKS",
        ],
      };

    case "RECOMMENDATIONS":
      return {
        topics: [
          "RECOMMENDATIONS",
          "RISKS",
        ],
      };

    default:
      return {
        topics: [
          "GENERAL",
        ],
      };
  }
}