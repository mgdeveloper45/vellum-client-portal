import { describe, expect, it } from "vitest";

import { buildBookingTimeline } from "../booking-timeline";

function buildInput() {
  return {
    bookingCreatedAt: new Date("2026-08-01T12:00:00.000Z"),
    hasProject: true,
    hasInvoice: true,
    invoicePaid: true,
    hasMessages: true,
    hasFiles: true,

    depositRequired: false,
    hasDeposit: false,
    depositPaid: false,
    depositOutstanding: 0,
  };
}

describe("buildBookingTimeline", () => {
  it("does not add a deposit event when a deposit is not required", () => {
    const timeline = buildBookingTimeline(buildInput());

    expect(timeline.some((event) => event.id === "deposit")).toBe(false);
  });

  it("shows a required deposit that has not been requested", () => {
    const timeline = buildBookingTimeline({
      ...buildInput(),
      depositRequired: true,
    });

    expect(timeline).toContainEqual({
      id: "deposit",
      title: "Deposit",
      description: "Required deposit has not been requested.",
      completed: false,
    });
  });

  it("shows an outstanding required deposit", () => {
    const timeline = buildBookingTimeline({
      ...buildInput(),
      depositRequired: true,
      hasDeposit: true,
      depositPaid: false,
      depositOutstanding: 250,
    });

    expect(timeline).toContainEqual({
      id: "deposit",
      title: "Deposit",
      description: "Required deposit has $250 outstanding.",
      completed: false,
    });
  });

  it("marks a fully paid required deposit complete", () => {
    const timeline = buildBookingTimeline({
      ...buildInput(),
      depositRequired: true,
      hasDeposit: true,
      depositPaid: true,
      depositOutstanding: 0,
    });

    expect(timeline).toContainEqual({
      id: "deposit",
      title: "Deposit",
      description: "Required deposit has been paid.",
      completed: true,
    });
  });
});
