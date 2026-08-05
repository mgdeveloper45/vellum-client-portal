import { describe, expect, it, vi } from "vitest";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

import { buildCopilotResponse } from "../copilot-service";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn().mockResolvedValue({
    narrative: "Everything looks healthy today.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  }),
}));

describe("buildCopilotResponse", () => {
  it("builds a copilot response from the dashboard", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "revenue");
    expect(response.answer).toBeTruthy();
    expect(response.evidence.length).toBeGreaterThan(0);
    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });

  it("routes revenue questions to the revenue responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "How is revenue doing?");
    expect(response.answer).toContain("Projected revenue");
  });

  it("routes booking questions to the booking responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "How are bookings?");
    expect(response.answer).toContain("Weekly booking utilization");
  });

  it("routes capacity questions to the capacity responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "How much capacity is available?",
    );

    expect(response.answer).toContain("Workspace utilization");
  });
});
