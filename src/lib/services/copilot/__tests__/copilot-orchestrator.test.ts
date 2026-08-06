import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/lib/testing/mocks/mock-executive-brief";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";
import { getOrCreateExecutiveBrief } from "@/lib/testing/mocks/mock-executive-brief";
import { buildCopilotContext } from "../copilot-context-builder";
import { buildExecutiveOverview } from "../copilot-orchestrator";


beforeEach(() => {
  vi.resetAllMocks();

  getOrCreateExecutiveBrief.mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildExecutiveOverview", () => {
  it("combines business intelligence", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildExecutiveOverview(context);

    expect(response.answer.length).toBeGreaterThan(100);

    expect(response.evidence.length).toBeGreaterThan(5);

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });
});
