import { describe, expect, it } from "vitest";
import { calculateFinanceHealth } from "../finance-health";

describe("calculateFinanceHealth", () => {
  it("returns healthy when finance profile has no issues", () => {
    const result = calculateFinanceHealth({
      totalRevenue: 5000,
      outstandingRevenue: 0,
      overdueInvoices: 0,
      paidInvoices: 10,
      totalInvoices: 10,
    });

    expect(result.status).toBe("HEALTHY");
    expect(result.score).toBe(100);
  });

  it("reduces score when revenue is outstanding", () => {
    const result = calculateFinanceHealth({
      totalRevenue: 5000,
      outstandingRevenue: 1200,
      overdueInvoices: 0,
      paidInvoices: 8,
      totalInvoices: 10,
    });

    expect(result.score).toBe(80);
    expect(result.status).toBe("NEEDS_ATTENTION");
  });

  it("marks finance as at risk when many invoices are overdue", () => {
    const result = calculateFinanceHealth({
      totalRevenue: 5000,
      outstandingRevenue: 3000,
      overdueInvoices: 5,
      paidInvoices: 0,
      totalInvoices: 5,
    });

    expect(result.status).toBe("AT_RISK");
  });
});
