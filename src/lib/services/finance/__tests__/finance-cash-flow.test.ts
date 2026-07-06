import { describe, expect, it } from "vitest";
import { calculateCashFlow } from "../finance-cash-flow";

describe("calculateCashFlow", () => {
  it("calculates available revenue", () => {
    const result = calculateCashFlow({
      totalRevenue: 10000,
      outstandingRevenue: 2500,
      overdueInvoices: 0,
      paidInvoices: 8,
      totalInvoices: 10,
    });

    expect(result.availableRevenue).toBe(7500);
    expect(result.outstandingRevenue).toBe(2500);
    expect(result.collectionRate).toBe(75);
  });

  it("handles zero revenue", () => {
    const result = calculateCashFlow({
      totalRevenue: 0,
      outstandingRevenue: 0,
      overdueInvoices: 0,
      paidInvoices: 0,
      totalInvoices: 0,
    });

    expect(result.collectionRate).toBe(100);
  });
});
