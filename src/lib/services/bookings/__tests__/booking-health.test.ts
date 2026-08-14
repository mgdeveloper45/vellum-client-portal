import { describe, expect, it } from "vitest";

import { calculateBookingHealth } from "../booking-health";

function buildHealthyInput() {
  return {
    status: "CONFIRMED",
    hasCalendarEvent: true,
    hasProject: true,
    hasInvoice: true,
    invoicePaid: true,
    hasMessages: true,
    hasFiles: true,
    bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

    depositRequired: false,
    hasDeposit: false,
    depositPaid: false,
    depositOutstanding: 0,
  };
}

describe("calculateBookingHealth", () => {
  it("does not penalize a booking when a deposit is not required", () => {
    const result = calculateBookingHealth(buildHealthyInput());

    expect(result.score).toBe(100);
    expect(result.label).toBe("HEALTHY");
    expect(result.reasons).toEqual(["Booking workflow looks healthy."]);
  });

  it("penalizes a required deposit that has not been requested", () => {
    const result = calculateBookingHealth({
      ...buildHealthyInput(),
      depositRequired: true,
    });

    expect(result.score).toBe(85);
    expect(result.reasons).toContain(
      "Required deposit has not been requested.",
    );
  });

  it("penalizes a required deposit with an outstanding balance", () => {
    const result = calculateBookingHealth({
      ...buildHealthyInput(),
      depositRequired: true,
      hasDeposit: true,
      depositPaid: false,
      depositOutstanding: 250,
    });

    expect(result.score).toBe(85);
    expect(result.reasons).toContain(
      "Required deposit still has an outstanding balance.",
    );
  });

  it("does not penalize a required deposit that has been fully paid", () => {
    const result = calculateBookingHealth({
      ...buildHealthyInput(),
      depositRequired: true,
      hasDeposit: true,
      depositPaid: true,
      depositOutstanding: 0,
    });

    expect(result.score).toBe(100);
    expect(result.label).toBe("HEALTHY");
  });
});
