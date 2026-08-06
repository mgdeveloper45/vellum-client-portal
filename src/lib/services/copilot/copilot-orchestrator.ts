import type { CopilotContext } from "./copilot-context-builder";
import type { CopilotResponse } from "./copilot-service";
import { buildRevenueResponse } from "./responders/revenue-response-builder";
import { buildBookingResponse } from "./responders/booking-response-builder";
import { buildCapacityResponse } from "./responders/capacity-response-builder";
import { buildInvoiceResponse } from "./responders/invoice-response-builder";
import { buildRiskResponse } from "./responders/risk-response-builder";
import { buildRecommendationsResponse } from "./responders/recommendations-response-builder";

export function buildExecutiveOverview(
  context: CopilotContext,
): CopilotResponse {
  const revenue = buildRevenueResponse(context);
  const bookings = buildBookingResponse(context);
  const capacity = buildCapacityResponse(context);
  const invoices = buildInvoiceResponse(context);
  const risks = buildRiskResponse(context);
  const recommendations = buildRecommendationsResponse(context);

  const responses = [
    revenue,
    bookings,
    capacity,
    invoices,
    risks,
    recommendations,
  ];

  return {
    answer: responses.map((response) => response.answer).join("\n\n"),

    evidence: responses.flatMap((response) => response.evidence),

    suggestedActions: responses.flatMap(
      (response) => response.suggestedActions,
    ),
  };
}
