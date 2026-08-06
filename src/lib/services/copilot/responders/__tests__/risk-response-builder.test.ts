import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn(),
}));

import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

import { buildCopilotContext } from "../../copilot-context-builder";
import { buildRiskResponse } from "../risk-response-builder";

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildRiskResponse", () => {
  it("returns executive risk information", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildRiskResponse(context);

    expect(response.answer.length).toBeGreaterThan(0);

    expect(response.evidence).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Executive score"),
        expect.stringContaining("Revenue risk"),
        expect.stringContaining("Booking risk"),
        expect.stringContaining("Capacity risk"),
      ]),
    );

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });
});

describe("buildRiskResponse", () => {
  it("returns executive risk information", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildRiskResponse(context);

    expect(response.answer.length).toBeGreaterThan(0);

    expect(response.evidence).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Executive score"),
        expect.stringContaining("Revenue risk"),
        expect.stringContaining("Booking risk"),
        expect.stringContaining("Capacity risk"),
      ]),
    );

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });
});