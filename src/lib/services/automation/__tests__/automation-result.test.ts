import { describe, expect, it } from "vitest";
import {
  buildAutomationExecutionPlan,
  executeAutomationPlan,
} from "../automation-engine";
import { createPlatformEvent } from "../../events/event-engine";
import type { AutomationRule } from "../automation-rule";

describe("executeAutomationPlan", () => {
  it("executes every planned action", () => {
    const rules: AutomationRule[] = [
      {
        id: "1",
        name: "Booking",
        trigger: "BOOKING_CREATED",
        enabled: true,
        actions: ["SEND_EMAIL", "SEND_NOTIFICATION"],
      },
    ];

    const event = createPlatformEvent("BOOKING_CREATED", "booking-1");

    const plan = buildAutomationExecutionPlan(event, rules);

    const result = executeAutomationPlan(plan);

    expect(result.successfulActions).toBe(2);
    expect(result.failedActions).toBe(0);
    expect(result.executedActions).toHaveLength(2);
  });
});
