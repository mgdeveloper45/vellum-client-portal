import type { CopilotContext } from "../copilot-context-builder";
import type { CopilotResponse } from "../copilot-service";

export function buildInvoiceResponse(context: CopilotContext): CopilotResponse {
  const outstanding = context.metrics.revenueOutstanding;
  const collected = context.metrics.revenueCollected;
  const risk = context.executive.summary.revenueRisk;

  const answer =
    outstanding > 0
      ? `There is currently $${outstanding.toLocaleString()} in outstanding invoices. Revenue risk is ${risk.toLowerCase()}.`
      : "There are no outstanding invoices requiring attention.";

  const evidence = [
    `Revenue collected: $${collected.toLocaleString()}`,
    `Outstanding invoices: $${outstanding.toLocaleString()}`,
    `Revenue risk: ${risk}`,
  ];

  const suggestedActions = context.executive.advice
    .filter((advice) => advice.category === "REVENUE")
    .map((advice) => advice.title);

  return {
    answer,
    evidence,
    suggestedActions,
  };
}
