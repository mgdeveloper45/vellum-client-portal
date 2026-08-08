import { describe, expect, it } from "vitest";

import { buildActionPlan } from "../action-planner";

describe("buildActionPlan", () => {
  it("creates invoice actions with the email executor", () => {
    expect(buildActionPlan("ACTION", "INVOICES")).toEqual({
      type: "DRAFT_EMAIL",
      executor: "EMAIL",
      confidence: 95,
      explanation: "The user is requesting an action related to invoices.",
    });
  });

  it("creates booking actions with the booking executor", () => {
    expect(buildActionPlan("ACTION", "BOOKINGS")).toEqual({
      type: "CREATE_BOOKING",
      executor: "BOOKING",
      confidence: 95,
      explanation: "The user is requesting a booking action.",
    });
  });

  it("creates project actions with the project executor", () => {
    expect(buildActionPlan("ACTION", "PROJECTS")).toEqual({
      type: "UPDATE_PROJECT",
      executor: "PROJECT",
      confidence: 90,
      explanation: "The user is requesting a project update.",
    });
  });

  it("uses the task executor for unspecialized actions", () => {
    expect(buildActionPlan("ACTION", "RECOMMENDATIONS")).toEqual({
      type: "CREATE_TASK",
      executor: "TASK",
      confidence: 75,
      explanation:
        "The user requested an action but no specialized executor was selected.",
    });
  });

  it("returns NONE when the intent is informational", () => {
    expect(buildActionPlan("NEW_QUESTION", "REVENUE")).toEqual({
      type: "NONE",
      executor: null,
      confidence: 100,
      explanation: "No executable action required.",
    });
  });
});
