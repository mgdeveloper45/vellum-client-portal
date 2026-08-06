import type { DashboardViewModel } from "@/lib/services/dashboard/dashboard-builder";
import { buildCopilotContext } from "./copilot-context-builder";
import { buildConversationPlan } from "./copilot-conversation-planner";
import { composeCopilotResponses } from "./copilot-response-composer";
import { mergeCopilotResponses } from "./copilot-response-merger";
import { routeCopilotQuestion } from "./copilot-question-router";

export interface CopilotResponse {
  answer: string;

  evidence: string[];

  suggestedActions: string[];
}

export function buildCopilotResponse(
  dashboard: DashboardViewModel,
  query: string,
): CopilotResponse {
  const context = buildCopilotContext(dashboard);

  const question = routeCopilotQuestion(query);

  const plan = buildConversationPlan(question);

  const responses = composeCopilotResponses(context, plan.topics);

  return mergeCopilotResponses(responses);
}
