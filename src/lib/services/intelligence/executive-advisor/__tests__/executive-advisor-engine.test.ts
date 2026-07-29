import { describe, expect, it } from "vitest";
import {
  createRevenueForecast,
  createBookingForecast,
  createWorkspaceCapacity,
  createInsight,
} from "../../__tests__/fixtures";
import { adviceById } from "../../__tests__/helpers";
import {
  buildExecutiveAdvisor,
  type ExecutiveAdvisorInput,
} from "../executive-advisor-engine";

function createInput(
  overrides: Partial<ExecutiveAdvisorInput> = {},
): ExecutiveAdvisorInput {
  return {
    revenueForecast: createRevenueForecast(),
    bookingForecast: createBookingForecast(),
    workspaceCapacity: createWorkspaceCapacity(),
    executiveInsights: [createInsight()],
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
    const capacityAdvice = adviceById(
  advice,
  "fill-open-capacity",
);
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
