import { describe, expect, it } from "vitest";
import { contributor } from "./helpers";
import {
  createBookingForecast,
  createInsights,
  createRevenueForecast,
  createWorkspaceCapacity,
} from "./fixtures";
import { buildExecutiveScore } from "../executive-score-engine";

describe("buildExecutiveScore", () => {
  it("builds a healthy executive score", () => {
    const result = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.grade).toBe("A");
    expect(result.status).toBe("Excellent");
    expect(result.contributors).toHaveLength(5);
  });

  it("reduces score when revenue at risk increases", () => {
    const healthy = buildExecutiveScore({
      revenueForecast: createRevenueForecast({
        revenueAtRisk: 0,
      }),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    const risky = buildExecutiveScore({
      revenueForecast: createRevenueForecast({
        revenueAtRisk: 50000,
      }),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    expect(risky.score).toBeLessThan(healthy.score);
  });

  it("reduces score when booking utilization decreases", () => {
    const healthy = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast({
        utilizationWeek: 90,
      }),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    const slow = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast({
        utilizationWeek: 20,
      }),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    expect(slow.score).toBeLessThan(healthy.score);
  });

  it("penalizes constrained capacity", () => {
    const healthy = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity({
        constrained: false,
      }),
      executiveInsights: [],
    });

    const constrained = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity({
        constrained: true,
      }),
      executiveInsights: [],
    });

    expect(contributor(constrained, "capacity").score).toBeLessThan(
      contributor(healthy, "capacity").score,
    );
  });

  it("penalizes many high-priority insights", () => {
    const healthy = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    const unhealthy = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: createInsights(5),
    });

    expect(contributor(unhealthy, "clients").score).toBeLessThan(
      contributor(healthy, "clients").score,
    );
  });

  it("uses the revenue trend as the executive trend", () => {
    const result = buildExecutiveScore({
      revenueForecast: createRevenueForecast({
        trend: "DOWN",
      }),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    expect(result.trend).toBe("DOWN");
  });

  it("creates all five contributors", () => {
    const result = buildExecutiveScore({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
      executiveInsights: [],
    });

    expect(result.contributors.map((c) => c.key)).toEqual([
      "revenue",
      "bookings",
      "capacity",
      "collections",
      "clients",
    ]);
  });
});
