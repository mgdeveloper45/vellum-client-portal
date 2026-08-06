import type { CopilotContext } from "./copilot-context-builder";
import type { CopilotTopic } from "./copilot-question-router";
import type { CopilotResponse } from "./copilot-service";

import { buildGeneralResponse } from "./responders/general-response-builder";
import { buildRevenueResponse } from "./responders/revenue-response-builder";
import { buildBookingResponse } from "./responders/booking-response-builder";
import { buildCapacityResponse } from "./responders/capacity-response-builder";
import { buildInvoiceResponse } from "./responders/invoice-response-builder";
import { buildRiskResponse } from "./responders/risk-response-builder";
import { buildClientResponse } from "./responders/client-response-builder";
import { buildProjectResponse } from "./responders/project-response-builder";
import { buildRecommendationsResponse } from "./responders/recommendations-response-builder";

export function composeCopilotResponses(
  context: CopilotContext,
  topics: CopilotTopic[],
): CopilotResponse[] {
  return topics.map((topic) => {
    switch (topic) {
      case "REVENUE":
        return buildRevenueResponse(context);

      case "BOOKINGS":
        return buildBookingResponse(context);

      case "CAPACITY":
        return buildCapacityResponse(context);

      case "INVOICES":
        return buildInvoiceResponse(context);

      case "RISKS":
        return buildRiskResponse(context);

      case "CLIENTS":
        return buildClientResponse(context);

      case "PROJECTS":
        return buildProjectResponse(context);

      case "RECOMMENDATIONS":
        return buildRecommendationsResponse(context);

      default:
        return buildGeneralResponse(context);
    }
  });
}
