import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildClientResponse(context: CopilotContext): CopilotResponse {
  const answer =
    "Client relationships are healthy based on the current executive intelligence.";

  const evidence = [
    `Revenue risk: ${context.executive.summary.revenueRisk}`,
    `Booking risk: ${context.executive.summary.bookingRisk}`,
    `Capacity risk: ${context.executive.summary.capacityRisk}`,
  ];

  const suggestedActions = context.executive.advice
    .filter((advice) => advice.category === "CLIENTS")
    .map((advice) => advice.title);

  return {
    answer,
    evidence,
    suggestedActions,
  };
}
