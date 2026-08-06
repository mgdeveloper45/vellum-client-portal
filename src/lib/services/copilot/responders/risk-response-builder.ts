import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildRiskResponse(context: CopilotContext): CopilotResponse {
  const summary = context.executive.summary;
  const topAdvice = context.executive.topAdvice;

  const answer =
    topAdvice?.reason ?? "No significant operational risks were detected.";

  const evidence = [
    `Executive score: ${summary.executiveScore}`,
    `Revenue risk: ${summary.revenueRisk}`,
    `Booking risk: ${summary.bookingRisk}`,
    `Capacity risk: ${summary.capacityRisk}`,
    `Critical actions: ${summary.criticalAdviceCount}`,
    `High priority actions: ${summary.highPriorityAdviceCount}`,
  ];

  const suggestedActions = context.executive.advice.map(
    (advice) => advice.title,
  );

  return {
    answer,
    evidence,
    suggestedActions,
  };
}
