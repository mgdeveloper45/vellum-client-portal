import { describe, expect, it } from "vitest";

import { ActionRegistry } from "../action-registry";

describe("ActionRegistry", () => {
  it("registers and resolves handlers", () => {
    const registry = new ActionRegistry();

    const handler = {
      execute: async () => ({
        success: true,
        message: "Executed",
      }),
    };

    registry.register("CREATE_TASK", handler);

    expect(registry.resolve("CREATE_TASK")).toBe(handler);
  });

  it("returns undefined for unknown actions", () => {
    const registry = new ActionRegistry();

    expect(registry.resolve("CREATE_BOOKING")).toBeUndefined();
  });
});
