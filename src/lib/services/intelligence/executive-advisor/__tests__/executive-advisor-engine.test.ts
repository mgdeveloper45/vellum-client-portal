import { describe, expect, it } from "vitest";

import {
  buildExecutiveAdvisor,
  type ExecutiveAdvisorInput,
} from "../executive-advisor-engine";

function createInput(
  overrides: Partial<ExecutiveAdvisorInput> = {},
): ExecutiveAdvisorInput {
  return {
    revenueForecast: {
      projectedRevenue: 18000,
      expectedCollections: 3000,
      revenueAtRisk: 1000,
      confidence: 90,
      trend: "UP",
      risk: "MEDIUM",
      summary: "Revenue is projected to improve.",
    },

    bookingForecast: {
      utilizationToday: 75,
      utilizationTomorrow: 50,
      utilizationWeek: 68,

      availableCapacityToday: 2,
      availableCapacityTomorrow: 4,
      availableCapacityWeek: 10,

      peakDayLabel: "Friday",
      peakDayUtilization: 100,

      trend: "STABLE",
      risk: "MEDIUM",
      confidence: 85,

      summary: "Booking demand is stable.",
      recommendation: "Focus outreach on Thursday.",
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

      summary: "The schedule has available capacity.",

      recommendation:
        "Focus booking outreach on Thursday, where 6 appointment slots remain available.",

      days: [],
    },

    executiveInsights: [
      {
        id: "review-pending-milestones",
        domain: "PROJECTS",
        priority: "MEDIUM",
        title: "Review pending milestones",
        explanation: "Two milestones need attention.",
        impact: "Resolving blockers protects delivery timelines.",
        recommendedAction: "Review blocked project work.",
        href: "/projects",
      },
    ],

    ...overrides,
  };
}

describe("buildExecutiveAdvisor", () => {
  it("ranks revenue protection as a high-value action", () => {
    const advice = buildExecutiveAdvisor(createInput());

    expect(advice[0].id).toBe("protect-revenue-at-risk");

    expect(advice[0].estimatedImpact).toBe(1000);

    expect(advice[0].category).toBe("REVENUE");
  });

  it("creates an open-capacity recommendation", () => {
    const advice = buildExecutiveAdvisor(createInput());

    const capacityAdvice = advice.find(
      (item) => item.id === "fill-open-capacity",
    );

    expect(capacityAdvice).toBeDefined();

    expect(capacityAdvice?.title).toContain("Thursday");

    expect(capacityAdvice?.estimatedImpact).toBe(2600);
  });

  it("includes existing executive insights", () => {
    const advice = buildExecutiveAdvisor(createInput());

    expect(
      advice.some((item) => item.id === "insight-review-pending-milestones"),
    ).toBe(true);
  });

  it("ranks critical revenue risk above lower-priority work", () => {
    const advice = buildExecutiveAdvisor(
      createInput({
        revenueForecast: {
          projectedRevenue: 10000,
          expectedCollections: 500,
          revenueAtRisk: 9000,
          confidence: 93,
          trend: "DOWN",
          risk: "HIGH",
          summary: "Revenue is exposed to significant risk.",
        },
      }),
    );

    expect(advice[0]).toMatchObject({
      id: "protect-revenue-at-risk",
      priority: "CRITICAL",
    });
  });

  it("returns healthy guidance when no advice candidates exist", () => {
    const advice = buildExecutiveAdvisor({
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

        summary: "The workspace is full.",
        recommendation: "Protect service quality.",

        days: [],
      },

      executiveInsights: [],
    });

    expect(advice).toHaveLength(1);

    expect(advice[0]).toMatchObject({
      id: "maintain-business-momentum",
      priority: "LOW",
    });
  });

  it("sorts advice by score descending", () => {
    const advice = buildExecutiveAdvisor(createInput());

    for (let index = 1; index < advice.length; index += 1) {
      expect(advice[index - 1].score).toBeGreaterThanOrEqual(
        advice[index].score,
      );
    }
  });
});
