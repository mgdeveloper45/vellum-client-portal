import { describe, expect, it } from "vitest";

import { buildActionPlan } from "../action-planner";

describe("buildActionPlan", () => {
  it("creates invoice actions", () => {
    expect(buildActionPlan("ACTION", "INVOICES").type).toBe("DRAFT_EMAIL");
  });

  it("creates booking actions", () => {
    expect(buildActionPlan("ACTION", "BOOKINGS").type).toBe("CREATE_BOOKING");
  });

  it("creates project actions", () => {
    expect(buildActionPlan("ACTION", "PROJECTS").type).toBe("UPDATE_PROJECT");
  });

  it("returns NONE when the intent is informational", () => {
    expect(buildActionPlan("NEW_QUESTION", "REVENUE").type).toBe("NONE");
  });
});
