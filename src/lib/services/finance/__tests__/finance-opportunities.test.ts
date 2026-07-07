import { describe, expect, it } from "vitest";
import { calculateFinanceOpportunities } from "../finance-opportunities";

describe("calculateFinanceOpportunities", () => {
  it("creates a high-priority opportunity for outstanding revenue", () => {
    const opportunities = calculateFinanceOpportunities({
      totalRevenue: 12000,
      outstandingRevenue: 2500,
      overdueInvoices: 1,
      paidInvoices: 9,
      totalInvoices: 10,
    });

    expect(opportunities).toHaveLength(1);
    expect(opportunities[0].priority).toBe("HIGH");
  });

  it("creates a low-priority opportunity for perfect collections", () => {
    const opportunities = calculateFinanceOpportunities({
      totalRevenue: 12000,
      outstandingRevenue: 0,
      overdueInvoices: 0,
      paidInvoices: 10,
      totalInvoices: 10,
    });

    expect(opportunities).toHaveLength(1);
    expect(opportunities[0].priority).toBe("LOW");
  });
});