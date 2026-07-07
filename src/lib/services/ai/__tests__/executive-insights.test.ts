import { describe, expect, it } from "vitest";
import { buildExecutiveNarrative } from "../executive-insights";

describe("buildExecutiveNarrative", () => {
  it("creates a readable executive narrative", () => {
    const narrative = buildExecutiveNarrative({
      summary: {
        overallHealth: 91,
        revenueHealth: 88,
        clientHealth: 94,
        workspaceHealth: 90,
        bookingHealth: 92,
        generatedAt: new Date(),
      },
      recommendations: [
        {
          id: "1",
          title: "Follow up overdue invoices",
          description: "",
          priority: "HIGH",
          category: "FINANCE",
          href: "/invoices",
        },
      ],
    });

    expect(narrative).toContain("Executive Daily Brief");
    expect(narrative).toContain("91");
    expect(narrative).toContain("Follow up overdue invoices");
  });
});