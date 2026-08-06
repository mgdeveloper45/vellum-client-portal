import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildProjectResponse(context: CopilotContext): CopilotResponse {
  const executiveScore = context.executive.summary.executiveScore;

  const answer =
    executiveScore >= 80
      ? "Projects are progressing well based on the current executive intelligence."
      : "Some projects may require additional attention.";

  const evidence = [
    `Executive score: ${executiveScore}`,
    `Revenue risk: ${context.executive.summary.revenueRisk}`,
    `Booking risk: ${context.executive.summary.bookingRisk}`,
    `Capacity risk: ${context.executive.summary.capacityRisk}`,
  ];

  const suggestedActions = context.executive.advice
    .filter((advice) => advice.category === "OPERATIONS")
    .map((advice) => advice.title);

  return {
    answer,
    evidence,
    suggestedActions,
  };
}
