import { describe, expect, it } from "vitest";
import { buildDashboardContext } from "../dashboard-engine";

describe("buildDashboardContext", () => {
  it("returns the supplied dashboard context", () => {
    const context = buildDashboardContext({
      executiveContext: {
        summary: {
          overallHealth: 91,
          revenueHealth: 89,
          clientHealth: 92,
          workspaceHealth: 90,
          bookingHealth: 94,
          generatedAt: new Date(),
        },
        recommendations: [],
      },
      executiveBrief: {
        title: "Executive Daily Brief",
        overview: "Overall platform health is 91/100.",
        topRecommendations: [],
      },
      timeline: [],
    });

    expect(context.executiveContext.summary.overallHealth).toBe(91);
    expect(context.timeline).toHaveLength(0);
  });
});
