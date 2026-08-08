import { describe, expect, it } from "vitest";

import { ActionRegistry } from "../action-registry";
import { orchestrateAction } from "../action-orchestrator";

describe("orchestrateAction", () => {
  it("executes automatic actions", async () => {
    const registry = new ActionRegistry();

    registry.register("EMAIL", {
      execute: async () => ({
        success: true,
        message: "Email drafted.",
        title: "Invoice Reminder",
        content: "Draft email body.",
        metadata: {
          action: "EMAIL",
        },
      }),
    });

    const result = await orchestrateAction(
      "Draft an invoice reminder email.",
      registry,
    );

    expect(result.success).toBe(true);

    expect(result.message).toBe("Email drafted.");

    expect(result.title).toBe("Invoice Reminder");

    expect(result.content).toContain("Draft");

    expect(result.metadata).toEqual({
      action: "EMAIL",
    });
  });

  it("requires confirmation for bookings", async () => {
    const registry = new ActionRegistry();

    const result = await orchestrateAction("Schedule a booking.", registry);

    expect(result.success).toBe(false);

    expect(result.message).toContain("Confirmation required");
  });

  it("returns a failure when no handler exists", async () => {
    const registry = new ActionRegistry();

    const result = await orchestrateAction(
      "Draft an invoice reminder.",
      registry,
    );

    expect(result.success).toBe(false);

    expect(result.message).toContain("No handler");
  });
});
