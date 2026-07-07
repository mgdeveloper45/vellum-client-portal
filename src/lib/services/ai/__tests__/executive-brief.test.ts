import { describe, expect, it } from "vitest";
import { buildExecutiveBrief } from "../executive-brief";

describe("buildExecutiveBrief", () => {
  it("creates a daily executive brief", () => {
    const brief = buildExecutiveBrief({
      summary: {
        overallHealth: 94,
        revenueHealth: 90,
        clientHealth: 96,
        workspaceHealth: 91,
        bookingHealth: 95,
        generatedAt: new Date(),
      },

      recommendations: [
        {
          id: "1",
          title: "Collect Outstanding Invoice",
          description: "Invoice overdue",
          priority: "HIGH",
          category: "FINANCE",
          href: "/invoices",
        },
      ],
    });

    expect(brief.title).toBe("Executive Daily Brief");
    expect(brief.topRecommendations).toHaveLength(1);
    expect(brief.overview).toContain("94");
  });
});
