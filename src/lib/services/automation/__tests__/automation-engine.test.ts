import { describe, expect, it } from "vitest";
import { getMatchingAutomationRules } from "../automation-engine";
import type { AutomationRule } from "../automation-rule";

describe("getMatchingAutomationRules", () => {
  const rules: AutomationRule[] = [
    {
      id: "1",
      name: "Booking Created Workflow",
      trigger: "BOOKING_CREATED",
      actions: ["CREATE_PROJECT", "SYNC_CALENDAR"],
      enabled: true,
    },
    {
      id: "2",
      name: "Disabled Booking Workflow",
      trigger: "BOOKING_CREATED",
      actions: ["SEND_EMAIL"],
      enabled: false,
    },
    {
      id: "3",
      name: "Invoice Paid Workflow",
      trigger: "INVOICE_PAID",
      actions: ["SEND_NOTIFICATION"],
      enabled: true,
    },
  ];

  it("returns enabled rules matching the trigger", () => {
    const matches = getMatchingAutomationRules("BOOKING_CREATED", rules);

    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe("1");
  });

  it("ignores disabled rules", () => {
    const matches = getMatchingAutomationRules("BOOKING_CREATED", rules);

    expect(matches.some((rule) => rule.id === "2")).toBe(false);
  });

  it("returns an empty array when no rules match", () => {
    const matches = getMatchingAutomationRules("PROJECT_CREATED", []);

    expect(matches).toEqual([]);
  });
});
