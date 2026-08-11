import { describe, expect, it } from "vitest";

import { planCopilotAction } from "../copilot-action-planner-service";

describe("planCopilotAction", () => {
  it("does not handle informational questions as actions", () => {
    const result = planCopilotAction("How is revenue doing?");

    expect(result.handled).toBe(false);
    expect(result.requiresConfirmation).toBe(false);
    expect(result.message).toBe("");
  });

  it("does not handle unsupported recommendation actions", () => {
    const result = planCopilotAction("Recommend what I should focus on next.");

    expect(result).toEqual({
      handled: false,
      action: "NONE",
      message: "",
      requiresConfirmation: false,
    });
  });

  it("requires confirmation for booking actions", () => {
    const result = planCopilotAction("Schedule a booking for tomorrow.");

    expect(result.handled).toBe(true);
    expect(result.requiresConfirmation).toBe(true);
    expect(result.message).toContain("CREATE_BOOKING");
  });

  it("requires confirmation for project actions", () => {
    const result = planCopilotAction("Update this project.");

    expect(result.handled).toBe(true);
    expect(result.requiresConfirmation).toBe(true);
    expect(result.message).toContain("UPDATE_PROJECT");
  });

  it("requires confirmation for invoice-related actions", () => {
    const result = planCopilotAction("Send a reminder for the unpaid invoice.");

    expect(result.handled).toBe(true);
    expect(result.requiresConfirmation).toBe(true);
    expect(result.message).toContain("DRAFT_EMAIL");
  });
});
