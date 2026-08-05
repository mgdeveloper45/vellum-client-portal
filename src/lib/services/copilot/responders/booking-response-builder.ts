import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildBookingResponse(context: CopilotContext): CopilotResponse {
  const forecast = context.forecasts.bookings;

  return {
    answer: `Weekly booking utilization is ${forecast.utilizationWeek}% and booking risk is ${forecast.risk.toLowerCase()}.`,

    evidence: [
      `Today's utilization: ${forecast.utilizationToday}%`,
      `Tomorrow's utilization: ${forecast.utilizationTomorrow}%`,
      `Weekly utilization: ${forecast.utilizationWeek}%`,
      `Trend: ${forecast.trend}`,
      `Risk: ${forecast.risk}`,
      `Confidence: ${forecast.confidence}%`,
    ],

    suggestedActions: [
      forecast.recommendation,
      ...context.executive.advice
        .filter((advice) => advice.category === "BOOKINGS")
        .map((advice) => advice.title),
    ],
  };
}
