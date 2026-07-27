import { describe, expect, it } from "vitest";

import { bookingSignalProducer, buildBookingSignals } from "../booking-signals";

describe("buildBookingSignals", () => {
  it("returns no signals when there is no booking activity or capacity", () => {
    const signals = buildBookingSignals({
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      upcomingBookings: 0,
      availableSlots: 0,
    });

    expect(signals).toEqual([]);
  });

  it("does not evaluate historical rates below the minimum sample size", () => {
    const signals = buildBookingSignals({
      totalBookings: 4,
      confirmedBookings: 1,
      cancelledBookings: 3,
      upcomingBookings: 0,
      availableSlots: 0,
    });

    expect(signals.some(({ id }) => id === "booking-cancellation-rate")).toBe(
      false,
    );

    expect(signals.some(({ id }) => id === "booking-confirmation-rate")).toBe(
      false,
    );
  });

  it("returns a high cancellation-rate signal", () => {
    const signals = buildBookingSignals({
      totalBookings: 20,
      confirmedBookings: 14,
      cancelledBookings: 6,
      upcomingBookings: 6,
      availableSlots: 4,
    });

    const signal = signals.find(({ id }) => id === "booking-cancellation-rate");

    expect(signal).toMatchObject({
      id: "booking-cancellation-rate",
      category: "BOOKINGS",
      severity: "HIGH",
      urgency: 75,
      confidence: 90,
      metadata: {
        totalBookings: 20,
        cancelledBookings: 6,
        cancellationRate: 30,
      },
    });
  });

  it("marks a critical cancellation rate as critical", () => {
    const signals = buildBookingSignals({
      totalBookings: 20,
      confirmedBookings: 10,
      cancelledBookings: 8,
      upcomingBookings: 6,
      availableSlots: 4,
    });

    const signal = signals.find(({ id }) => id === "booking-cancellation-rate");

    expect(signal).toMatchObject({
      severity: "CRITICAL",
      urgency: 90,
      metadata: {
        cancellationRate: 40,
      },
    });
  });

  it("returns a confirmation-rate signal below the target", () => {
    const signals = buildBookingSignals({
      totalBookings: 10,
      confirmedBookings: 6,
      cancelledBookings: 2,
      upcomingBookings: 5,
      availableSlots: 5,
    });

    const signal = signals.find(({ id }) => id === "booking-confirmation-rate");

    expect(signal).toMatchObject({
      id: "booking-confirmation-rate",
      category: "BOOKINGS",
      severity: "HIGH",
      metadata: {
        totalBookings: 10,
        confirmedBookings: 6,
        confirmationRate: 60,
      },
    });
  });

  it("marks a critically low confirmation rate as critical", () => {
    const signals = buildBookingSignals({
      totalBookings: 10,
      confirmedBookings: 4,
      cancelledBookings: 3,
      upcomingBookings: 5,
      availableSlots: 5,
    });

    const signal = signals.find(({ id }) => id === "booking-confirmation-rate");

    expect(signal).toMatchObject({
      severity: "CRITICAL",
      urgency: 85,
      metadata: {
        confirmationRate: 40,
      },
    });
  });

  it("returns a low-utilization signal when most future slots are open", () => {
    const signals = buildBookingSignals({
      totalBookings: 10,
      confirmedBookings: 8,
      cancelledBookings: 1,
      upcomingBookings: 2,
      availableSlots: 8,
    });

    const signal = signals.find(({ id }) => id === "booking-low-utilization");

    expect(signal).toMatchObject({
      id: "booking-low-utilization",
      category: "BOOKINGS",
      severity: "MEDIUM",
      metadata: {
        upcomingBookings: 2,
        availableSlots: 8,
        utilizationRate: 20,
      },
    });
  });

  it("returns a capacity-pressure signal when the schedule is nearly full", () => {
    const signals = buildBookingSignals({
      totalBookings: 20,
      confirmedBookings: 18,
      cancelledBookings: 1,
      upcomingBookings: 18,
      availableSlots: 2,
    });

    const signal = signals.find(({ id }) => id === "booking-capacity-pressure");

    expect(signal).toMatchObject({
      id: "booking-capacity-pressure",
      category: "BOOKINGS",
      severity: "MEDIUM",
      metadata: {
        upcomingBookings: 18,
        availableSlots: 2,
        utilizationRate: 90,
      },
    });
  });

  it("returns a healthy booking-pipeline signal", () => {
    const signals = buildBookingSignals({
      totalBookings: 20,
      confirmedBookings: 18,
      cancelledBookings: 1,
      upcomingBookings: 6,
      availableSlots: 4,
    });

    expect(signals).toHaveLength(1);

    expect(signals[0]).toMatchObject({
      id: "booking-healthy-pipeline",
      category: "BOOKINGS",
      severity: "LOW",
      metadata: {
        cancellationRate: 5,
        confirmationRate: 90,
        utilizationRate: 60,
      },
    });
  });

  it("exposes booking signals through the standard producer contract", () => {
    const input = {
      totalBookings: 20,
      confirmedBookings: 18,
      cancelledBookings: 1,
      upcomingBookings: 6,
      availableSlots: 4,
    };

    expect(bookingSignalProducer.build(input)).toEqual(
      buildBookingSignals(input),
    );

    expect(Object.isFrozen(bookingSignalProducer)).toBe(true);
  });

  it("returns an immutable signal collection", () => {
    const signals = buildBookingSignals({
      totalBookings: 20,
      confirmedBookings: 18,
      cancelledBookings: 1,
      upcomingBookings: 6,
      availableSlots: 4,
    });

    expect(Object.isFrozen(signals)).toBe(true);
  });
});
