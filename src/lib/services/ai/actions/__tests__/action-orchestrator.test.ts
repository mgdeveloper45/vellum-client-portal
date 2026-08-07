import { describe, expect, it } from "vitest";

import { ActionRegistry } from "../action-registry";
import { orchestrateAction } from "../action-orchestrator";

describe("orchestrateAction", () => {
  it("executes automatic actions", async () => {
    const registry = new ActionRegistry();

    registry.register("DRAFT_EMAIL", {
      execute: async () => ({
        success: true,
        message: "Email drafted.",
      }),
    });

    const result = await orchestrateAction(
      "Draft an invoice reminder email.",
      registry,
    );

    expect(result.success).toBe(true);

    expect(result.message).toBe("Email drafted.");
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
