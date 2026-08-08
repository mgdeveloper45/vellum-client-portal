import { describe, expect, it } from "vitest";

import { buildEvidence } from "../evidence-builder";

describe("buildEvidence", () => {
  it("builds executive evidence", () => {
    const evidence = buildEvidence({
      executiveScore: 91,

      revenueRisk: "LOW",
      bookingRisk: "MEDIUM",
      capacityRisk: "LOW",

      revenueCollected: 18500,
      revenueOutstanding: 2400,
      previousPeriodRevenue: 17000,
      upcomingBookingRevenue: 9200,

      topAdvice: "Follow up on outstanding invoices.",

      recommendations: [],

      morningBrief: "Business is operating normally.",

      aiNarrative: "Executive dashboard summary.",
    });

    expect(evidence).toEqual([
      {
        label: "Executive Score",
        value: "91",
      },
      {
        label: "Revenue Risk",
        value: "LOW",
      },
      {
        label: "Booking Risk",
        value: "MEDIUM",
      },
      {
        label: "Capacity Risk",
        value: "LOW",
      },
      {
        label: "Revenue Collected",
        value: "$18,500",
      },
      {
        label: "Outstanding Revenue",
        value: "$2,400",
      },
      {
        label: "Upcoming Revenue",
        value: "$9,200",
      },
      {
        label: "Top Recommendation",
        value: "Follow up on outstanding invoices.",
      },
    ]);
  });
});
