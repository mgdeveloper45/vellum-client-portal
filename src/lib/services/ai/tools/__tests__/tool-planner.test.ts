import { describe, expect, it } from "vitest";

import { buildToolPlan } from "../tool-planner";

describe("buildToolPlan", () => {
  it("selects the invoice tool", () => {
    expect(buildToolPlan("ACTION", "INVOICES").tool).toBe("DRAFT_EMAIL");
  });

  it("selects the booking tool", () => {
    expect(buildToolPlan("ACTION", "BOOKINGS").tool).toBe("CREATE_BOOKING");
  });

  it("returns null for informational questions", () => {
    expect(buildToolPlan("NEW_QUESTION", "REVENUE").tool).toBeNull();
  });
});
