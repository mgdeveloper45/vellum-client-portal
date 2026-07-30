import { describe, expect, it } from "vitest";

import {
  createBookingForecast,
  createInsight,
  createRevenueForecast,
  createWorkspaceCapacity,
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
  it("creates revenue-protection advice when revenue is at risk", () => {
    const revenueForecast = createRevenueForecast({
      revenueAtRisk: 1_000,
      risk: "MEDIUM",
      trend: "DOWN",
    });

    const advice = buildExecutiveAdvisor(
      createInput({
        revenueForecast,
      }),
    );

    const revenueAdvice = adviceById(advice, "protect-revenue-at-risk");

    expect(revenueAdvice).toMatchObject({
      id: "protect-revenue-at-risk",
      estimatedImpact: revenueForecast.revenueAtRisk,
      category: "REVENUE",
      priority: "HIGH",
    });
  });

  it("creates an open-capacity recommendation", () => {
    const workspaceCapacity = createWorkspaceCapacity();

    const advice = buildExecutiveAdvisor(
      createInput({
        workspaceCapacity,
      }),
    );

    const capacityAdvice = adviceById(advice, "fill-open-capacity");

    expect(capacityAdvice).toMatchObject({
      id: "fill-open-capacity",
      estimatedImpact: workspaceCapacity.estimatedOpenRevenue,
      category: "BOOKINGS",
    });

    expect(capacityAdvice.title).toContain(
      workspaceCapacity.lowestUtilizationDay?.label,
    );
  });

  it("includes existing executive insights", () => {
    const insight = createInsight({
      id: "review-pending-milestones",
    });

    const advice = buildExecutiveAdvisor(
      createInput({
        executiveInsights: [insight],
      }),
    );

    expect(advice.some((item) => item.id === `insight-${insight.id}`)).toBe(
      true,
    );
  });

  it("maps an executive insight to advice fields", () => {
    const insight = createInsight({
      id: "cash-flow-review",
      domain: "FINANCE",
      priority: "HIGH",
      title: "Review cash flow",
      recommendedAction: "Review outstanding balances.",
      href: "/invoices",
    });

    const advice = buildExecutiveAdvisor(
      createInput({
        executiveInsights: [insight],
      }),
    );

    const insightAdvice = adviceById(advice, `insight-${insight.id}`);

    expect(insightAdvice).toMatchObject({
      title: insight.title,
      category: "REVENUE",
      priority: "HIGH",
      confidence: 90,
      recommendedAction: insight.recommendedAction,
      href: insight.href,
    });
  });

  it("ranks critical revenue risk above lower-priority work", () => {
    const advice = buildExecutiveAdvisor(
      createInput({
        revenueForecast: createRevenueForecast({
          projectedRevenue: 10_000,
          expectedCollections: 500,
          revenueAtRisk: 9_000,
          confidence: 93,
          trend: "DOWN",
          risk: "HIGH",
          summary: "Revenue is exposed to significant risk.",
        }),
      }),
    );

    expect(advice[0]).toMatchObject({
      id: "protect-revenue-at-risk",
      priority: "CRITICAL",
    });
  });

  it("creates booking-risk advice when booking health declines", () => {
    const bookingForecast = createBookingForecast({
      risk: "HIGH",
      trend: "DOWN",
      confidence: 88,
      summary: "Booking demand has declined.",
      recommendation: "Increase booking outreach.",
    });

    const advice = buildExecutiveAdvisor(
      createInput({
        bookingForecast,
      }),
    );

    const bookingAdvice = adviceById(advice, "stabilize-booking-demand");

    expect(bookingAdvice).toMatchObject({
      id: "stabilize-booking-demand",
      title: "Stabilize booking demand",
      priority: "HIGH",
      category: "BOOKINGS",
      confidence: bookingForecast.confidence,
      recommendedAction: bookingForecast.recommendation,
    });
  });

  it("returns healthy guidance when no advice candidates exist", () => {
    const advice = buildExecutiveAdvisor({
      revenueForecast: createRevenueForecast({
        projectedRevenue: 10_000,
        expectedCollections: 0,
        revenueAtRisk: 0,
        confidence: 90,
        trend: "STABLE",
        risk: "LOW",
        summary: "Revenue is stable.",
      }),

      bookingForecast: createBookingForecast({
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
      }),

      workspaceCapacity: createWorkspaceCapacity({
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
      }),

      executiveInsights: [],
    });

    expect(advice).toHaveLength(1);

    expect(advice[0]).toMatchObject({
      id: "maintain-business-momentum",
      priority: "LOW",
      category: "OPERATIONS",
    });
  });

  it("sorts advice by score descending", () => {
    const advice = buildExecutiveAdvisor(
      createInput({
        revenueForecast: createRevenueForecast({
          revenueAtRisk: 1_000,
          risk: "MEDIUM",
          trend: "DOWN",
        }),

        bookingForecast: createBookingForecast({
          risk: "MEDIUM",
          trend: "DOWN",
        }),
      }),
    );

    for (let index = 1; index < advice.length; index += 1) {
      expect(advice[index - 1].score).toBeGreaterThanOrEqual(
        advice[index].score,
      );
    }
  });
});
