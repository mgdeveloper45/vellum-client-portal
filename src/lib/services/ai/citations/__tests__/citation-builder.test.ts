import { describe, expect, it } from "vitest";

import { buildBusinessCitations } from "../citation-builder";

describe("buildBusinessCitations", () => {
  it("builds executive citations", () => {
    const citations = buildBusinessCitations({
      executiveScore: 92,

      revenueRisk: "LOW",
      bookingRisk: "MEDIUM",
      capacityRisk: "LOW",

      revenueCollected: 15000,
      revenueOutstanding: 2400,
      previousPeriodRevenue: 12000,
      upcomingBookingRevenue: 3800,

      topAdvice: "Collect outstanding invoices.",

      recommendations: [],

      morningBrief: "Healthy.",

      aiNarrative: "Healthy business.",
    });

    expect(citations).toHaveLength(8);

    expect(citations[0]).toEqual({
      title: "Executive Score",
      value: "92",
    });
  });
});
