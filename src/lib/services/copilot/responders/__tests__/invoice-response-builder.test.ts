import { describe, expect, it, vi } from "vitest";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import {
  createHealthyDashboardQueryResult,
} from "@/lib/services/dashboard/__tests__/fixtures";

import { buildCopilotContext } from "../../copilot-context-builder";
import { buildInvoiceResponse } from "../invoice-response-builder";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn().mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  }),
}));

describe("buildInvoiceResponse", () => {
  it("builds an invoice response", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildInvoiceResponse(context);

    expect(response.answer).toContain("outstanding");

    expect(response.evidence).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Revenue collected"),
        expect.stringContaining("Outstanding invoices"),
      ]),
    );

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });
});