import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn(),
}));

import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

import { buildCopilotContext } from "../copilot-context-builder";
import { composeCopilotResponses } from "../copilot-response-composer";

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("composeCopilotResponses", () => {
  it("composes multiple copilot responses", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const responses = composeCopilotResponses(context, [
      "REVENUE",
      "BOOKINGS",
      "CAPACITY",
    ]);

    expect(responses).toHaveLength(3);

    responses.forEach((response) => {
      expect(response.answer.length).toBeGreaterThan(0);
      expect(response.evidence.length).toBeGreaterThan(0);
      expect(response.suggestedActions).toBeDefined();
    });
  });

  it("supports invoice and recommendation composition", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const responses = composeCopilotResponses(context, [
      "INVOICES",
      "RECOMMENDATIONS",
    ]);

    expect(responses).toHaveLength(2);

    expect(responses[0].answer.length).toBeGreaterThan(0);
    expect(responses[1].answer.length).toBeGreaterThan(0);
  });

  it("falls back to the general responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const responses = composeCopilotResponses(context, ["GENERAL"]);

    expect(responses).toHaveLength(1);
    expect(responses[0].answer.length).toBeGreaterThan(0);
  });
});
