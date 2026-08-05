import { describe, expect, it } from "vitest";
import type { BookingForecast } from "@/lib/services/intelligence/forecasting/booking-forecast-engine";
import type { RevenueForecast } from "@/lib/services/intelligence/forecasting/revenue-forecast-engine";
import type { WorkspaceCapacity } from "@/lib/services/intelligence/capacity/workspace-capacity-engine";
import type { DashboardForecastResult } from "../dashboard-forecast-builder";
import { buildExecutiveIntelligence } from "../executive-intelligence-builder";

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
    summary: "Revenue is healthy.",

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

    summary: "Bookings are healthy.",
    recommendation: "Continue booking outreach.",

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
      bookings: 6,
      openSlots: 2,
      utilizationRate: 75,
      estimatedOpenRevenue: 200,
    },

    tomorrow: {
      label: "Tue",
      capacity: 8,
      bookings: 5,
      openSlots: 3,
      utilizationRate: 63,
      estimatedOpenRevenue: 300,
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

    summary: "Capacity is healthy.",
    recommendation: "Maintain schedule.",

    days: [],

    ...overrides,
  };
}

function createDashboard(
  overrides: Partial<DashboardForecastResult> = {},
): DashboardForecastResult {
  return {
    revenueForecast: createRevenueForecast(),
    bookingForecast: createBookingForecast(),
    workspaceCapacity: createWorkspaceCapacity(),

    ...overrides,
  } as DashboardForecastResult;
}

describe("buildExecutiveIntelligence", () => {
  it("returns EXCELLENT health when every forecast is healthy", () => {
    const intelligence = buildExecutiveIntelligence(createDashboard());

    expect(intelligence.health).toBe("EXCELLENT");

    expect(intelligence.strengths).toHaveLength(3);

    expect(intelligence.recommendations).toEqual([
      "Continue executing scheduled work and maintaining client relationships.",
    ]);
  });

  it("returns GOOD health when only medium risks exist", () => {
    const intelligence = buildExecutiveIntelligence(
      createDashboard({
        bookingForecast: createBookingForecast({
          risk: "MEDIUM",
          summary: "Bookings slowing.",
          recommendation: "Increase bookings.",
        }),
      }),
    );

    expect(intelligence.health).toBe("GOOD");

    expect(intelligence.risks).toContain("Bookings slowing.");

    expect(intelligence.recommendations).toContain("Increase bookings.");
  });

  it("returns WATCH health when one HIGH risk exists", () => {
    const intelligence = buildExecutiveIntelligence(
      createDashboard({
        revenueForecast: createRevenueForecast({
          risk: "HIGH",
          summary: "Revenue risk.",
        }),
      }),
    );

    expect(intelligence.health).toBe("WATCH");

    expect(intelligence.risks).toContain("Revenue risk.");

    expect(intelligence.recommendations).toContain(
      "Review outstanding invoices and improve collections.",
    );
  });

  it("returns CRITICAL health when two HIGH risks exist", () => {
    const intelligence = buildExecutiveIntelligence(
      createDashboard({
        revenueForecast: createRevenueForecast({
          risk: "HIGH",
          summary: "Revenue risk.",
        }),

        bookingForecast: createBookingForecast({
          risk: "HIGH",
          summary: "Booking risk.",
          recommendation: "Booking recommendation.",
        }),
      }),
    );

    expect(intelligence.health).toBe("CRITICAL");
  });

  it("includes healthy summaries as strengths", () => {
    const intelligence = buildExecutiveIntelligence(createDashboard());

    expect(intelligence.strengths).toContain("Revenue is healthy.");

    expect(intelligence.strengths).toContain("Bookings are healthy.");

    expect(intelligence.strengths).toContain("Capacity is healthy.");
  });

  it("uses booking recommendation when booking risk exists", () => {
    const intelligence = buildExecutiveIntelligence(
      createDashboard({
        bookingForecast: createBookingForecast({
          risk: "HIGH",
          summary: "Booking summary.",
          recommendation: "Increase marketing.",
        }),
      }),
    );

    expect(intelligence.recommendations).toContain("Increase marketing.");
  });

  it("uses capacity recommendation when workspace capacity risk exists", () => {
    const intelligence = buildExecutiveIntelligence(
      createDashboard({
        workspaceCapacity: createWorkspaceCapacity({
          risk: "HIGH",
          summary: "Capacity summary.",
          recommendation: "Hire another technician.",
        }),
      }),
    );

    expect(intelligence.recommendations).toContain("Hire another technician.");
  });

  it("always returns the executive headline", () => {
    const intelligence = buildExecutiveIntelligence(createDashboard());

    expect(intelligence.headline).toBe("Executive Business Intelligence");
  });
});
