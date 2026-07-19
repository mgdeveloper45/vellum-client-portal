import { describe, expect, it } from "vitest";

import { BusinessHoursPolicy } from "../business-hours-policy";
import { createSchedulingContext } from "../../test-utils/create-scheduling-context";
import { createDecision } from "../../test-utils/create-scheduling-decision";

describe("BusinessHoursPolicy", () => {
  it("allows bookings during business hours", async () => {
    const context = createSchedulingContext();

    const decision = createDecision();

    const policy = new BusinessHoursPolicy();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
  });
});
