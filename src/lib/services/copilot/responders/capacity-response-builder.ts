import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildCapacityResponse(
  context: CopilotContext,
): CopilotResponse {
  const capacity = context.forecasts.capacity;

  return {
    answer: `Workspace utilization is ${capacity.weeklyUtilizationRate}% with ${capacity.weeklyOpenSlots} open appointment ${
      capacity.weeklyOpenSlots === 1 ? "slot" : "slots"
    } remaining.`,

    evidence: [
      `Weekly utilization: ${capacity.weeklyUtilizationRate}%`,
      `Weekly bookings: ${capacity.weeklyBookings}`,
      `Weekly capacity: ${capacity.weeklyCapacity}`,
      `Open slots: ${capacity.weeklyOpenSlots}`,
      `Estimated open revenue: $${capacity.estimatedOpenRevenue.toLocaleString()}`,
      `Risk: ${capacity.risk}`,
    ],

    suggestedActions: [
  capacity.recommendation,
  ...context.executive.advice
    .filter(
      (advice) =>
        advice.category === "BOOKINGS" &&
        advice.recommendedAction !== capacity.recommendation,
    )
    .map((advice) => advice.title),
],
  };
}
