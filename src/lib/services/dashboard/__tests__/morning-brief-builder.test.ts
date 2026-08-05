import { describe, expect, it } from "vitest";

import { buildMorningBrief } from "../morning-brief-builder";
import type { DashboardForecastResult } from "../dashboard-forecast-builder";

import type { RevenueForecast } from "@/lib/services/intelligence/forecasting/revenue-forecast-engine";
import type { BookingForecast } from "@/lib/services/intelligence/forecasting/booking-forecast-engine";
import type { WorkspaceCapacity } from "@/lib/services/intelligence/capacity/workspace-capacity-engine";

function createRevenueForecast(
  overrides: Partial<RevenueForecast> = {},
): RevenueForecast {
  return {
    projectedRevenue: 10000,
    expectedCollections: 8000,
    revenueAtRisk: 0,
    confidence: 90,
    trend: "UP",
    risk: "LOW",
    summary: "Revenue healthy.",
    ...overrides,
  };
}

function createBookingForecast(
  overrides: Partial<BookingForecast> = {},
): BookingForecast {
  return {
    utilizationToday: 75,
    utilizationTomorrow: 70,
    utilizationWeek: 72,

    availableCapacityToday: 2,
    availableCapacityTomorrow: 3,
    availableCapacityWeek: 8,

    peakDayLabel: "Friday",
    peakDayUtilization: 100,

    trend: "UP",
    risk: "LOW",
    confidence: 90,

    summary: "Bookings healthy.",
    recommendation: "Increase marketing.",

    ...overrides,
  };
}

function createWorkspaceCapacity(
  overrides: Partial<WorkspaceCapacity> = {},
): WorkspaceCapacity {
  return {
    today: {
      label: "Mon",
      capacity: 8,
      bookings: 5,
      openSlots: 3,
      utilizationRate: 63,
      estimatedOpenRevenue: 300,
    },

    tomorrow: {
      label: "Tue",
      capacity: 8,
      bookings: 6,
      openSlots: 2,
      utilizationRate: 75,
      estimatedOpenRevenue: 200,
    },

    weeklyCapacity: 40,
    weeklyBookings: 30,
    weeklyOpenSlots: 10,
    weeklyUtilizationRate: 75,

    estimatedOpenRevenue: 1000,

    lowestUtilizationDay: null,
    highestUtilizationDay: null,

    constrained: false,
    risk: "LOW",

    summary: "Capacity healthy.",
    recommendation: "Maintain schedule.",

    days: [],

    ...overrides,
  };
}

function createDashboard(
  overrides: Partial<DashboardForecastResult> = {},
): DashboardForecastResult {
  return {
    revenueCollected: 25000,
    revenueOutstanding: 5000,

    revenueForecast: createRevenueForecast(),
    bookingForecast: createBookingForecast(),
    workspaceCapacity: createWorkspaceCapacity(),

    ...overrides,
  } as DashboardForecastResult;
}

describe("buildMorningBrief", () => {
  it("builds the standard morning brief", () => {
    const brief = buildMorningBrief(createDashboard());

    expect(brief.headline).toBe("Good morning. Here's what's happening today.");

    expect(brief.highlights).toHaveLength(2);

    expect(brief.actionItems).toHaveLength(1);
  });

  it("includes collected revenue", () => {
    const brief = buildMorningBrief(createDashboard());

    expect(brief.highlights[0]).toContain("25,000");
  });

  it("includes today's booking count", () => {
    const brief = buildMorningBrief(createDashboard());

    expect(brief.highlights[1]).toContain("5 bookings today");
  });

  it("includes outstanding invoice collection", () => {
    const brief = buildMorningBrief(createDashboard());

    expect(brief.actionItems[0]).toContain("5,000");
  });

  it("does not create a collection action when revenue is current", () => {
    const brief = buildMorningBrief(
      createDashboard({
        revenueOutstanding: 0,
      }),
    );

    expect(brief.actionItems).toHaveLength(0);
  });

  it("includes booking recommendations for HIGH booking risk", () => {
    const brief = buildMorningBrief(
      createDashboard({
        bookingForecast: createBookingForecast({
          risk: "HIGH",
          utilizationWeek: 42,
          recommendation: "Increase booking outreach.",
        }),
      }),
    );

    expect(brief.actionItems).toContain(
      "Increase booking outreach. (42% weekly utilization)",
    );
  });

  it("does not include booking recommendations for LOW booking risk", () => {
    const brief = buildMorningBrief(
      createDashboard({
        revenueOutstanding: 0,
      }),
    );

    expect(brief.actionItems).toEqual([]);
  });
});
