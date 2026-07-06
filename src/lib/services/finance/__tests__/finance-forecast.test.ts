import { describe, expect, it } from "vitest";
import { calculateRevenueForecast } from "../finance-forecast";

describe("calculateRevenueForecast", () => {
  it("returns a high confidence forecast", () => {
    const result = calculateRevenueForecast({
      totalRevenue: 10000,
      outstandingRevenue: 500,
      overdueInvoices: 0,
      paidInvoices: 19,
      totalInvoices: 20,
    });

    expect(result.projectedRevenue).toBe(10500);
    expect(result.confidence).toBe("HIGH");
  });

  it("returns a low confidence forecast", () => {
    const result = calculateRevenueForecast({
      totalRevenue: 10000,
      outstandingRevenue: 5000,
      overdueInvoices: 4,
      paidInvoices: 5,
      totalInvoices: 10,
    });

    expect(result.confidence).toBe("LOW");
  });
});
