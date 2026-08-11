import type { DashboardViewModel } from "@/lib/services/dashboard/dashboard-builder";
import type { AiGeneratedDocument } from "@/lib/services/ai/actions/action-types";

import { buildCopilotContext } from "./copilot-context-builder";
import { buildConversationPlan } from "./copilot-conversation-planner";
import { composeCopilotResponses } from "./copilot-response-composer";
import { routeCopilotIntent } from "./copilot-intent-router";
import { mergeCopilotResponses } from "./copilot-response-merger";
import { routeCopilotQuestion } from "./copilot-question-router";

export interface CopilotResponse {
  answer: string;
  evidence: string[];
  suggestedActions: string[];
  generatedDocument?: AiGeneratedDocument;
}

export function buildCopilotResponse(
  dashboard: DashboardViewModel,
  query: string,
): CopilotResponse {
  const intent = routeCopilotIntent(query);

  if (intent.intent !== "ANSWER") {
    return buildGenerationIntentResponse(intent.intent);
  }

  const context = buildCopilotContext(dashboard);

  const question = routeCopilotQuestion(query);

  const plan = buildConversationPlan(question);

  const responses = composeCopilotResponses(context, plan.topics);

  return mergeCopilotResponses(responses);
}

function buildGenerationIntentResponse(
  intent: Exclude<ReturnType<typeof routeCopilotIntent>["intent"], "ANSWER">,
): CopilotResponse {
  switch (intent) {
    case "PROJECT_SUMMARY":
      return {
        answer:
          "I can generate an executive summary when a project is selected.",
        evidence: [],
        suggestedActions: [
          "Open a project and generate its executive summary.",
        ],
      };

    case "PROJECT_STATUS":
      return {
        answer: "I can assess project status when a project is selected.",
        evidence: [],
        suggestedActions: ["Open a project and check its current status."],
      };

    case "PROPOSAL":
      return {
        answer: "I can generate a proposal when a project is selected.",
        evidence: [],
        suggestedActions: ["Open a project and generate a proposal."],
      };
  }
}
