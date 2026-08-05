import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildRevenueResponse(
  context: CopilotContext,
): CopilotResponse {
  return {
    answer: `Projected revenue is $${context.forecasts.revenue.projectedRevenue.toLocaleString()} with ${context.executive.summary.revenueRisk.toLowerCase()} revenue risk.`,

    evidence: [
      `Projected revenue: $${context.forecasts.revenue.projectedRevenue.toLocaleString()}`,
      `Outstanding revenue: $${context.metrics.revenueOutstanding.toLocaleString()}`,
      `Risk: ${context.executive.summary.revenueRisk}`,
      `Confidence: ${context.forecasts.revenue.confidence}%`,
    ],

    suggestedActions: context.executive.advice
      .filter((advice) => advice.category === "REVENUE")
      .map((advice) => advice.title),
  };
}