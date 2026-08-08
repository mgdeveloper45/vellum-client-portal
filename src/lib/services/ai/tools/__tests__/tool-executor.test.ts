import { describe, expect, it } from "vitest";

import { ToolRegistry } from "../tool-registry";
import { executeTool } from "../tool-executor";

describe("executeTool", () => {
  it("executes a registered tool", async () => {
    const registry = new ToolRegistry();

    registry.register({
      id: "DRAFT_EMAIL",
      execute: async () => "Email drafted.",
    });

    const result = await executeTool(registry, "DRAFT_EMAIL", {});

    expect(result).toBe("Email drafted.");
  });

  it("throws for unknown tools", async () => {
    const registry = new ToolRegistry();

    await expect(executeTool(registry, "DRAFT_EMAIL", {})).rejects.toThrow(
      "No tool registered for DRAFT_EMAIL.",
    );
  });
});
