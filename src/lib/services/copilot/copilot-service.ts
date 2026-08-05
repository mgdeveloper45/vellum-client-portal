import type { DashboardViewModel } from "@/lib/services/dashboard/dashboard-builder";
import { buildCopilotContext } from "./copilot-context-builder";
import { routeCopilotQuestion } from "./copilot-question-router";
import { buildBookingResponse } from "./responders/booking-response-builder";
import { buildCapacityResponse } from "./responders/capacity-response-builder";
import { buildGeneralResponse } from "./responders/general-response-builder";
import { buildRevenueResponse } from "./responders/revenue-response-builder";

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

  switch (question.topic) {
    case "REVENUE":
      return buildRevenueResponse(context);

    case "BOOKINGS":
      return buildBookingResponse(context);

    case "CAPACITY":
      return buildCapacityResponse(context);

    default:
      return buildGeneralResponse(context);
  }
}
