import { describe, expect, it, vi } from "vitest";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

import { buildCopilotContext } from "../../copilot-context-builder";
import { buildRevenueResponse } from "../revenue-response-builder";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn().mockResolvedValue({
    narrative: "Healthy business.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  }),
}));

describe("buildRevenueResponse", () => {
  it("builds a revenue response", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildRevenueResponse(context);

    expect(response.answer).toContain("Projected revenue");

    expect(response.evidence.length).toBeGreaterThan(0);

    expect(Array.isArray(response.suggestedActions)).toBe(true);
  });
});