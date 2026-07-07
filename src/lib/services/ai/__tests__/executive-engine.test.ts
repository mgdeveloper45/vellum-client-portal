import { describe, expect, it } from "vitest";
import { buildExecutiveContext } from "../executive-engine";

describe("buildExecutiveContext", () => {
  it("combines summary and recommendations", () => {
    const context = buildExecutiveContext(
      {
        overallHealth: 90,
        revenueHealth: 88,
        clientHealth: 94,
        workspaceHealth: 91,
        bookingHealth: 95,
        generatedAt: new Date(),
      },
      [
        {
          id: "1",
          title: "Collect Outstanding Invoice",
          description: "Invoice #102 is overdue.",
          priority: "HIGH",
          category: "FINANCE",
          href: "/invoices",
        },
      ],
    );

    expect(context.summary.overallHealth).toBe(90);
    expect(context.recommendations).toHaveLength(1);
    expect(context.recommendations[0].category).toBe("FINANCE");
  });
});
