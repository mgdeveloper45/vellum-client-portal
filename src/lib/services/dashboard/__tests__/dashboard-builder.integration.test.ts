import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn(),
}));
import { getOrCreateExecutiveBrief } from "@/lib/services/ai/executive-brief-service";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import {
  createHealthyDashboardQueryResult,
  createEmptyDashboardQueryResult,
} from "./fixtures";

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(getOrCreateExecutiveBrief).mockResolvedValue({
    narrative: "Executive dashboard summary.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  });
});

describe("buildDashboard", () => {
  it("builds a complete dashboard view model", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    //
    // Forecasts
    //

    expect(dashboard.revenueForecast).toBeDefined();
    expect(dashboard.bookingForecast).toBeDefined();
    expect(dashboard.workspaceCapacity).toBeDefined();

    //
    // Dashboard presentation
    //

    expect(dashboard.heroMetrics).toHaveLength(5);
    expect(dashboard.professionalMetrics).toHaveLength(5);
    expect(dashboard.bookingTrendData).toHaveLength(7);

    //
    // Executive pipeline
    //

    expect(dashboard.executiveIntelligence).toBeDefined();
    expect(dashboard.executiveAdvice.length).toBeGreaterThan(0);

    expect(dashboard.topAdvice).toEqual(dashboard.executiveAdvice[0] ?? null);

    expect(dashboard.executiveIntelligence.summary.adviceCount).toBe(
      dashboard.executiveAdvice.length,
    );

    //
    // Dashboard context
    //

    expect(dashboard.executiveContext).toBeDefined();
    expect(dashboard.dashboardContext).toBeDefined();
    expect(dashboard.morningBrief).toBeDefined();

    //
    // View model
    //

    expect(dashboard.firstName).toBe("Marcus");

    expect(dashboard.todaysBookings).toEqual([]);
    expect(dashboard.upcomingBookings).toEqual([]);

    expect(dashboard.recentActivity).toEqual([]);
    expect(dashboard.recentNotifications).toEqual([]);

    //
    // AI
    //

    expect(dashboard.aiResult).toEqual({
      narrative: "Executive dashboard summary.",
      provider: "test",
      durationMs: 1,
      mode: "mock",
    });
  });

  it("builds an empty workspace dashboard", async () => {
    const dashboard = await buildDashboard({
      data: createEmptyDashboardQueryResult(),
    });

    expect(dashboard.heroMetrics).toHaveLength(5);
    expect(dashboard.professionalMetrics).toHaveLength(5);
    expect(dashboard.bookingTrendData).toHaveLength(7);

    expect(dashboard.executiveContext).toBeDefined();
    expect(dashboard.executiveIntelligence).toBeDefined();
    expect(dashboard.aiResult).toBeDefined();
  });

  it("builds an at-risk dashboard", async () => {
    const { createAtRiskDashboardQueryResult } = await import("./fixtures");

    const dashboard = await buildDashboard({
      data: createAtRiskDashboardQueryResult(),
    });

    expect(dashboard.executiveAdvice.length).toBeGreaterThan(0);
    expect(dashboard.revenueForecast.risk).not.toBe("LOW");
  });

  it("requests an executive AI brief", async () => {
    await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    expect(getOrCreateExecutiveBrief).toHaveBeenCalled();
    expect(getOrCreateExecutiveBrief).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      dashboardContext: expect.any(Object),
    });
  });
});
