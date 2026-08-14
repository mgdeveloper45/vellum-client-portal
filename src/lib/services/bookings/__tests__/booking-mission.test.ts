import { describe, expect, it } from "vitest";

import { determineBookingMission } from "../booking-mission";

function buildInput() {
  return {
    lifecycle: "PREPARING" as const,

    health: {
      score: 85,
      label: "HEALTHY" as const,
      reasons: [],
    },

    countdown: {
      label: "7 days",
      daysRemaining: 7,
      urgent: false,
    },

    actions: [],

    depositRequired: false,
    hasDeposit: false,
    depositPaid: false,
    depositOutstanding: 0,
  };
}

describe("determineBookingMission", () => {
  it("prioritizes requesting a required deposit", () => {
    const mission = determineBookingMission({
      ...buildInput(),
      depositRequired: true,
      hasDeposit: false,
    });

    expect(mission).toEqual({
      title: "Request Required Deposit",
      description:
        "Request the required deposit before continuing the booking workflow.",
      priority: "HIGH",
    });
  });

  it("prioritizes collecting an outstanding required deposit", () => {
    const mission = determineBookingMission({
      ...buildInput(),
      depositRequired: true,
      hasDeposit: true,
      depositPaid: false,
      depositOutstanding: 250,
    });

    expect(mission).toEqual({
      title: "Collect Outstanding Deposit",
      description: "Collect the remaining $250 deposit balance.",
      priority: "HIGH",
    });
  });

  it("does not prioritize deposit collection when the required deposit is paid", () => {
    const mission = determineBookingMission({
      ...buildInput(),
      depositRequired: true,
      hasDeposit: true,
      depositPaid: true,
      depositOutstanding: 0,
    });

    expect(mission).toEqual({
      title: "Continue Booking Workflow",
      description: "Proceed with the next recommended action.",
      priority: "MEDIUM",
    });
  });

  it("keeps immediate-attention health above deposit collection", () => {
    const mission = determineBookingMission({
      ...buildInput(),

      health: {
        score: 40,
        label: "AT_RISK",
        reasons: ["Calendar event has not been synced."],
      },

      depositRequired: true,
      hasDeposit: true,
      depositPaid: false,
      depositOutstanding: 250,
    });

    expect(mission).toEqual({
      title: "Booking Needs Immediate Attention",
      description: "Calendar event has not been synced.",
      priority: "HIGH",
    });
  });
});
