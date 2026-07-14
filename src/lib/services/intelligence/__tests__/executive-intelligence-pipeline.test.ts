import { describe, expect, it } from "vitest";
import { buildExecutiveIntelligencePipeline } from "../executive-intelligence-pipeline";

describe("buildExecutiveIntelligencePipeline", () => {
  it("combines intelligence engines into one result", () => {
    const pipeline = buildExecutiveIntelligencePipeline({
      revenueForecast: {
        projectedRevenue: 18000,
        expectedCollections: 3000,
        revenueAtRisk: 1200,
        confidence: 91,
        trend: "UP",
        risk: "MEDIUM",
        summary:
          "Revenue is projected to improve through collections and upcoming bookings.",
      },

      bookingForecast: {
        utilizationToday: 75,
        utilizationTomorrow: 50,
        utilizationWeek: 68,

        availableCapacityToday: 2,
        availableCapacityTomorrow: 4,
        availableCapacityWeek: 13,

        peakDayLabel: "Friday",
        peakDayUtilization: 100,

        trend: "STABLE",
        risk: "MEDIUM",
        confidence: 85,

        summary: "Booking demand is stable based on the upcoming schedule.",

        recommendation:
          "Focus outreach on Thursday, where open capacity remains.",
      },

      workspaceCapacity: {
        today: {
          label: "Monday",
          capacity: 8,
          bookings: 6,
          openSlots: 2,
          utilizationRate: 75,
          estimatedOpenRevenue: 400,
        },

        tomorrow: {
          label: "Tuesday",
          capacity: 8,
          bookings: 4,
          openSlots: 4,
          utilizationRate: 50,
          estimatedOpenRevenue: 800,
        },

        weeklyCapacity: 40,
        weeklyBookings: 27,
        weeklyOpenSlots: 13,
        weeklyUtilizationRate: 68,

        estimatedOpenRevenue: 2600,

        lowestUtilizationDay: {
          label: "Thursday",
          capacity: 8,
          bookings: 2,
          openSlots: 6,
          utilizationRate: 25,
          estimatedOpenRevenue: 1200,
        },

        highestUtilizationDay: {
          label: "Friday",
          capacity: 8,
          bookings: 8,
          openSlots: 0,
          utilizationRate: 100,
          estimatedOpenRevenue: 0,
        },

        constrained: false,
        risk: "MEDIUM",

        summary:
          "The schedule has available capacity that could support additional revenue.",

        recommendation:
          "Focus booking outreach on Thursday, where 6 appointment slots remain available.",

        days: [],
      },

      executiveInsights: [
        {
          id: "recover-outstanding-revenue",
          domain: "FINANCE",
          priority: "HIGH",
          title: "Recover outstanding revenue",
          explanation: "One unpaid invoice requires follow-up.",
          impact: "$1,200 is currently awaiting collection.",
          recommendedAction: "Contact the highest-value unpaid client first.",
          href: "/invoices",
        },
      ],
    });

    expect(pipeline.revenueForecast.projectedRevenue).toBe(18000);

    expect(pipeline.bookingForecast.utilizationToday).toBe(75);

    expect(pipeline.workspaceCapacity.weeklyOpenSlots).toBe(13);

    expect(pipeline.executiveAdvice.length).toBeGreaterThan(0);

    expect(pipeline.topAdvice).not.toBeNull();

    expect(pipeline.summary.adviceCount).toBe(pipeline.executiveAdvice.length);
  });

  it("returns the highest-scoring advice as top advice", () => {
    const pipeline = buildExecutiveIntelligencePipeline({
      revenueForecast: {
        projectedRevenue: 10000,
        expectedCollections: 500,
        revenueAtRisk: 9000,
        confidence: 94,
        trend: "DOWN",
        risk: "HIGH",
        summary: "Revenue is exposed to significant collection risk.",
      },

      bookingForecast: {
        utilizationToday: 90,
        utilizationTomorrow: 90,
        utilizationWeek: 90,

        availableCapacityToday: 0,
        availableCapacityTomorrow: 0,
        availableCapacityWeek: 0,

        peakDayLabel: "Monday",
        peakDayUtilization: 100,

        trend: "STABLE",
        risk: "LOW",
        confidence: 90,

        summary: "Booking demand is healthy.",
        recommendation: "Protect confirmed appointments.",
      },

      workspaceCapacity: {
        today: {
          label: "Monday",
          capacity: 8,
          bookings: 8,
          openSlots: 0,
          utilizationRate: 100,
          estimatedOpenRevenue: 0,
        },

        tomorrow: {
          label: "Tuesday",
          capacity: 8,
          bookings: 8,
          openSlots: 0,
          utilizationRate: 100,
          estimatedOpenRevenue: 0,
        },

        weeklyCapacity: 40,
        weeklyBookings: 40,
        weeklyOpenSlots: 0,
        weeklyUtilizationRate: 100,

        estimatedOpenRevenue: 0,

        lowestUtilizationDay: null,
        highestUtilizationDay: null,

        constrained: true,
        risk: "LOW",

        summary: "The schedule is operating at full capacity.",

        recommendation: "Protect service quality and confirmed work.",

        days: [],
      },

      executiveInsights: [],
    });

    expect(pipeline.topAdvice).toMatchObject({
      id: "protect-revenue-at-risk",
      priority: "CRITICAL",
    });

    expect(pipeline.summary.criticalAdviceCount).toBeGreaterThan(0);
  });

  it("returns healthy guidance when no urgent issues exist", () => {
    const pipeline = buildExecutiveIntelligencePipeline({
      revenueForecast: {
        projectedRevenue: 10000,
        expectedCollections: 0,
        revenueAtRisk: 0,
        confidence: 90,
        trend: "STABLE",
        risk: "LOW",
        summary: "Revenue is stable.",
      },

      bookingForecast: {
        utilizationToday: 90,
        utilizationTomorrow: 90,
        utilizationWeek: 90,

        availableCapacityToday: 0,
        availableCapacityTomorrow: 0,
        availableCapacityWeek: 0,

        peakDayLabel: "Monday",
        peakDayUtilization: 100,

        trend: "STABLE",
        risk: "LOW",
        confidence: 90,

        summary: "Bookings are healthy.",
        recommendation: "Protect confirmed appointments.",
      },

      workspaceCapacity: {
        today: {
          label: "Monday",
          capacity: 8,
          bookings: 8,
          openSlots: 0,
          utilizationRate: 100,
          estimatedOpenRevenue: 0,
        },

        tomorrow: {
          label: "Tuesday",
          capacity: 8,
          bookings: 8,
          openSlots: 0,
          utilizationRate: 100,
          estimatedOpenRevenue: 0,
        },

        weeklyCapacity: 40,
        weeklyBookings: 40,
        weeklyOpenSlots: 0,
        weeklyUtilizationRate: 100,

        estimatedOpenRevenue: 0,

        lowestUtilizationDay: null,
        highestUtilizationDay: null,

        constrained: true,
        risk: "LOW",

        summary: "The workspace is operating at full capacity.",

        recommendation: "Protect service quality.",

        days: [],
      },

      executiveInsights: [],
    });

    expect(pipeline.executiveAdvice).toHaveLength(1);

    expect(pipeline.topAdvice).toMatchObject({
      id: "maintain-business-momentum",
      priority: "LOW",
    });

    expect(pipeline.summary.criticalAdviceCount).toBe(0);
    expect(pipeline.summary.highPriorityAdviceCount).toBe(0);
  });
});
