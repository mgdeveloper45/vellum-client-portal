import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn(),
}));

import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { buildCopilotContext } from "../copilot-context-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});


describe("buildCopilotContext", () => {
  it("builds a copilot context from the dashboard", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    expect(context.executive.summary).toEqual(
      dashboard.executiveIntelligence.summary,
    );

    expect(context.forecasts.revenue).toEqual(
      dashboard.revenueForecast,
    );

    expect(context.forecasts.bookings).toEqual(
      dashboard.bookingForecast,
    );

    expect(context.forecasts.capacity).toEqual(
      dashboard.workspaceCapacity,
    );

    expect(context.metrics.revenueCollected).toBe(
      dashboard.revenueCollected,
    );
  });
});