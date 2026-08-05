import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/lib/testing/mocks/mock-executive-brief";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";
import { getOrCreateExecutiveBrief } from "@/lib/testing/mocks/mock-executive-brief";
import { buildCopilotContext } from "../../copilot-context-builder";
import { buildCapacityResponse } from "../capacity-response-builder";


beforeEach(() => {
  vi.resetAllMocks();

  getOrCreateExecutiveBrief.mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildCapacityResponse", () => {
  it("builds a capacity response", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildCapacityResponse(context);

    expect(response.answer).toContain("Workspace utilization");

    expect(response.evidence.length).toBeGreaterThan(0);

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });

  it("includes capacity evidence", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildCapacityResponse(context);

    expect(response.evidence).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Weekly utilization"),
        expect.stringContaining("Weekly bookings"),
        expect.stringContaining("Weekly capacity"),
        expect.stringContaining("Open slots"),
      ]),
    );
  });

  it("returns capacity recommendations", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const context = buildCopilotContext(dashboard);

    const response = buildCapacityResponse(context);

    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });
});
