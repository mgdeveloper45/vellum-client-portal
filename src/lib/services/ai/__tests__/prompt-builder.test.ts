import { describe, expect, it } from "vitest";

import { buildCopilotPrompt } from "../prompt-builder";

describe("buildCopilotPrompt", () => {
  it("includes verified business evidence", () => {
    const prompt = buildCopilotPrompt(
      {
        executiveScore: 91,

        revenueRisk: "LOW",
        bookingRisk: "MEDIUM",
        capacityRisk: "LOW",

        revenueCollected: 18500,
        revenueOutstanding: 2400,
        previousPeriodRevenue: 17000,
        upcomingBookingRevenue: 9200,

        topAdvice: "Collect outstanding invoices.",

        recommendations: ["Call overdue clients."],

        morningBrief: "Business is operating normally.",

        aiNarrative: "Executive dashboard summary.",
      },
      "How is my business?",
    );

    expect(prompt).toContain("Verified Business Evidence");

    expect(prompt).toContain("Executive Score: 91");

    expect(prompt).toContain("Revenue Risk: LOW");

    expect(prompt).toContain("Outstanding Revenue: $2,400");

    expect(prompt).toContain("How is my business?");
  });
});
