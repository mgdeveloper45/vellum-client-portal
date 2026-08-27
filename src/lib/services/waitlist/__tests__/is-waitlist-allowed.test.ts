import { describe, expect, it } from "vitest";

import type { BookingRule } from "@/lib/services/scheduling/booking-rules";

import { isWaitlistAllowed } from "../is-waitlist-allowed";

function rule(
  overrides: Partial<BookingRule> = {},
): BookingRule {
  return {
    id: "rule-1",
    name: "Allow waitlist",
    type: "ALLOW_WAITLIST",
    enabled: true,
    priority: 100,
    ...overrides,
  };
}

describe("isWaitlistAllowed", () => {
  it("allows a workspace-wide waitlist rule", () => {
    expect(
      isWaitlistAllowed([rule()], "service-1"),
    ).toBe(true);
  });

  it("allows a rule for the selected service", () => {
    expect(
      isWaitlistAllowed(
        [
          rule({
            appliesToServiceId: "service-1",
          }),
        ],
        "service-1",
      ),
    ).toBe(true);
  });

  it("rejects a rule for another service", () => {
    expect(
      isWaitlistAllowed(
        [
          rule({
            appliesToServiceId: "service-2",
          }),
        ],
        "service-1",
      ),
    ).toBe(false);
  });

  it("rejects a disabled rule", () => {
    expect(
      isWaitlistAllowed(
        [
          rule({
            enabled: false,
          }),
        ],
        "service-1",
      ),
    ).toBe(false);
  });

  it("rejects unrelated booking rules", () => {
    expect(
      isWaitlistAllowed(
        [
          rule({
            type: "REQUIRE_DEPOSIT",
          }),
        ],
        "service-1",
      ),
    ).toBe(false);
  });

  it("returns false when there are no rules", () => {
    expect(
      isWaitlistAllowed([], "service-1"),
    ).toBe(false);
  });
});
