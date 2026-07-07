import { describe, expect, it } from "vitest";
import { buildExecutiveSummary } from "../executive-summary";

describe("buildExecutiveSummary", () => {
  it("returns the supplied summary", () => {
    const summary = buildExecutiveSummary({
      overallHealth: 92,
      revenueHealth: 88,
      clientHealth: 95,
      workspaceHealth: 90,
      bookingHealth: 94,
      generatedAt: new Date(),
    });

    expect(summary.overallHealth).toBe(92);
    expect(summary.clientHealth).toBe(95);
  });
});
