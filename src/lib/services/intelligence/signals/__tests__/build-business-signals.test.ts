import { describe, expect, it } from "vitest";

import { buildBusinessSignals } from "../build-business-signals";

describe("buildBusinessSignals", () => {
  it("returns no signals when no conditions apply", () => {
    const signals = buildBusinessSignals({
      finance: {
        totalRevenue: 0,
        outstandingRevenue: 0,
        paidInvoices: 0,
        totalInvoices: 0,
        overdueInvoices: 0,
      },
    });

    expect(signals).toEqual([]);
  });

  it("preserves compatibility when booking input is omitted", () => {
    const signals = buildBusinessSignals({
      finance: {
        totalRevenue: 20_000,
        outstandingRevenue: 0,
        paidInvoices: 10,
        totalInvoices: 10,
        overdueInvoices: 0,
      },
    });

    expect(signals).toHaveLength(1);

    expect(signals[0]).toMatchObject({
      id: "finance-healthy-cash-flow",
      score: 135,
    });
  });

  it("aggregates finance and booking signals", () => {
    const signals = buildBusinessSignals({
      finance: {
        totalRevenue: 50_000,
        outstandingRevenue: 15_000,
        paidInvoices: 8,
        totalInvoices: 10,
        overdueInvoices: 4,
      },
      booking: {
        totalBookings: 20,
        confirmedBookings: 18,
        cancelledBookings: 1,
        upcomingBookings: 2,
        availableSlots: 8,
      },
    });

    expect(signals.some(({ id }) => id === "finance-outstanding-revenue")).toBe(
      true,
    );

    expect(signals.some(({ id }) => id === "booking-low-utilization")).toBe(
      true,
    );
  });

  it("ranks signals across different business domains", () => {
    const signals = buildBusinessSignals({
      finance: {
        totalRevenue: 100_000,
        outstandingRevenue: 50_000,
        paidInvoices: 9,
        totalInvoices: 10,
        overdueInvoices: 12,
      },
      booking: {
        totalBookings: 20,
        confirmedBookings: 18,
        cancelledBookings: 1,
        upcomingBookings: 2,
        availableSlots: 8,
      },
    });

    expect(signals[0].id).toBe("finance-outstanding-revenue");

    expect(signals[0].score).toBeGreaterThanOrEqual(signals[1].score);
  });

  it("returns a frozen ranked signal collection", () => {
    const signals = buildBusinessSignals({
      finance: {
        totalRevenue: 20_000,
        outstandingRevenue: 0,
        paidInvoices: 10,
        totalInvoices: 10,
        overdueInvoices: 0,
      },
      booking: {
        totalBookings: 20,
        confirmedBookings: 18,
        cancelledBookings: 1,
        upcomingBookings: 6,
        availableSlots: 4,
      },
    });

    expect(Object.isFrozen(signals)).toBe(true);

    expect(signals.every(({ score }) => typeof score === "number")).toBe(true);
  });
});
