import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildRecommendationsResponse(
  context: CopilotContext,
): CopilotResponse {
  const topAdvice = context.executive.topAdvice;

  const answer =
    topAdvice?.recommendedAction ??
    "Continue executing today's scheduled work.";

  const evidence = [
    `Executive score: ${context.executive.summary.executiveScore}`,
    `Critical actions: ${context.executive.summary.criticalAdviceCount}`,
    `High priority actions: ${context.executive.summary.highPriorityAdviceCount}`,
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
