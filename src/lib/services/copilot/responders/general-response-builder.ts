import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildGeneralResponse(context: CopilotContext): CopilotResponse {
  return {
    answer: context.aiBrief.narrative ?? context.morningBrief.executiveSummary,

    evidence: [
      `Executive score: ${context.executive.summary.executiveScore}`,
      `Revenue risk: ${context.executive.summary.revenueRisk}`,
      `Booking risk: ${context.executive.summary.bookingRisk}`,
      `Capacity risk: ${context.executive.summary.capacityRisk}`,
    ],

    suggestedActions: context.executive.advice.map((advice) => advice.title),
  };
}
