import { describe, expect, it } from "vitest";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { buildCopilotContext } from "@/lib/services/copilot/copilot-context-builder";
import { buildBusinessContext } from "../business-context";

import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";

import { beforeEach, vi } from "vitest";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildBusinessContext", () => {
  it("builds an AI business context", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const copilot = buildCopilotContext(dashboard);

    const business = buildBusinessContext(copilot);

    expect(business.executiveScore).toBeGreaterThan(0);

    expect(business.recommendations.length).toBeGreaterThan(0);

    expect(business.aiNarrative).toBe("Executive dashboard summary.");

    expect(business.morningBrief.length).toBeGreaterThan(0);
  });
});
