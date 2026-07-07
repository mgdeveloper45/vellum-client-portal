import { describe, expect, it } from "vitest";
import { buildFinanceEngine } from "../finance-engine";

describe("buildFinanceEngine", () => {
  it("builds the finance engine", () => {
    const engine = buildFinanceEngine({
      totalRevenue: 10000,
      outstandingRevenue: 1000,
      overdueInvoices: 1,
      paidInvoices: 9,
      totalInvoices: 10,
    });

    expect(engine.health.status).toBe("NEEDS_ATTENTION");
    expect(engine.cashFlow.availableRevenue).toBe(9000);
    expect(engine.forecast.projectedRevenue).toBe(11000);
    expect(engine.collections.requiresAttention).toBe(true);
  });
});
