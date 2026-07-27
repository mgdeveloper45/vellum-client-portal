import { describe, expect, it } from "vitest";

import { buildFinanceSignals, financeSignalProducer } from "../finance-signals";

describe("buildFinanceSignals", () => {
  it("returns a healthy cash-flow signal when all revenue is collected", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 20_000,
      outstandingRevenue: 0,
      paidInvoices: 10,
      totalInvoices: 10,
      overdueInvoices: 0,
    });

    expect(signals).toHaveLength(1);

    expect(signals[0]).toMatchObject({
      id: "finance-healthy-cash-flow",
      category: "FINANCE",
      severity: "LOW",
      title: "Healthy cash flow",
    });
  });

  it("returns an outstanding-revenue signal for a large unpaid balance", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 50_000,
      outstandingRevenue: 15_000,
      paidInvoices: 8,
      totalInvoices: 10,
      overdueInvoices: 4,
    });

    const signal = signals.find(
      ({ id }) => id === "finance-outstanding-revenue",
    );

    expect(signal).toMatchObject({
      id: "finance-outstanding-revenue",
      category: "FINANCE",
      severity: "HIGH",
      impact: 30,
      urgency: 70,
      confidence: 95,
      metadata: {
        outstandingRevenue: 15_000,
        overdueInvoices: 4,
      },
    });
  });

  it("marks outstanding revenue as critical at the critical threshold", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 60_000,
      outstandingRevenue: 25_000,
      paidInvoices: 8,
      totalInvoices: 10,
      overdueInvoices: 10,
    });

    const signal = signals.find(
      ({ id }) => id === "finance-outstanding-revenue",
    );

    expect(signal).toMatchObject({
      severity: "CRITICAL",
      impact: 50,
      urgency: 90,
    });
  });

  it("returns a collection-rate signal when collection is below target", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 20_000,
      outstandingRevenue: 8_000,
      paidInvoices: 7,
      totalInvoices: 10,
      overdueInvoices: 3,
    });

    const signal = signals.find(({ id }) => id === "finance-collection-rate");

    expect(signal).toMatchObject({
      id: "finance-collection-rate",
      category: "FINANCE",
      severity: "HIGH",
      impact: 80,
      urgency: 75,
      confidence: 90,
      metadata: {
        collectionRate: 70,
      },
    });
  });

  it("marks a critically low collection rate as critical", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 20_000,
      outstandingRevenue: 8_000,
      paidInvoices: 5,
      totalInvoices: 10,
      overdueInvoices: 3,
    });

    const signal = signals.find(({ id }) => id === "finance-collection-rate");

    expect(signal).toMatchObject({
      severity: "CRITICAL",
      metadata: {
        collectionRate: 50,
      },
    });
  });

  it("does not report a poor collection rate when there are no invoices", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 0,
      outstandingRevenue: 0,
      paidInvoices: 0,
      totalInvoices: 0,
      overdueInvoices: 0,
    });

    expect(signals.some(({ id }) => id === "finance-collection-rate")).toBe(
      false,
    );

    expect(signals).toHaveLength(0);
  });

  it("returns multiple applicable finance signals", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 50_000,
      outstandingRevenue: 30_000,
      paidInvoices: 4,
      totalInvoices: 10,
      overdueInvoices: 12,
    });

    expect(signals.map(({ id }) => id)).toEqual([
      "finance-outstanding-revenue",
      "finance-collection-rate",
    ]);
  });

  it("returns a frozen signal collection", () => {
    const signals = buildFinanceSignals({
      totalRevenue: 20_000,
      outstandingRevenue: 0,
      paidInvoices: 10,
      totalInvoices: 10,
      overdueInvoices: 0,
    });

    expect(Object.isFrozen(signals)).toBe(true);
  });

  it("exposes finance signals through the standard producer contract", () => {
    const input = {
      totalRevenue: 50_000,
      outstandingRevenue: 15_000,
      paidInvoices: 8,
      totalInvoices: 10,
      overdueInvoices: 4,
    };

    const functionalResult = buildFinanceSignals(input);

    const producerResult = financeSignalProducer.build(input);

    expect(producerResult).toEqual(functionalResult);

    expect(Object.isFrozen(financeSignalProducer)).toBe(true);

    expect(Object.isFrozen(producerResult)).toBe(true);
  });
});
