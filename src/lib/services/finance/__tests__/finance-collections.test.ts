import { describe, expect, it } from "vitest";
import { calculateCollections } from "../finance-collections";

describe("calculateCollections", () => {
  it("flags accounts requiring attention", () => {
    const result = calculateCollections({
      totalRevenue: 10000,
      outstandingRevenue: 2000,
      overdueInvoices: 2,
      paidInvoices: 8,
      totalInvoices: 10,
    });

    expect(result.requiresAttention).toBe(true);
    expect(result.overdueInvoices).toBe(2);
    expect(result.outstandingRevenue).toBe(2000);
  });

  it("returns healthy collections", () => {
    const result = calculateCollections({
      totalRevenue: 10000,
      outstandingRevenue: 0,
      overdueInvoices: 0,
      paidInvoices: 10,
      totalInvoices: 10,
    });

    expect(result.requiresAttention).toBe(false);
  });
});
