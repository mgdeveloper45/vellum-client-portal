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

    registry.register("TASK", handler);

    expect(registry.resolve("TASK")).toBe(handler);
  });

  it("returns undefined for unknown executors", () => {
    const registry = new ActionRegistry();

    expect(registry.resolve("BOOKING")).toBeUndefined();
  });

  it("requires a registered handler", () => {
    const registry = new ActionRegistry();

    const handler = {
      execute: async () => ({
        success: true,
        message: "Executed",
      }),
    };

    registry.register("EMAIL", handler);

    expect(registry.require("EMAIL")).toBe(handler);
  });

  it("throws when requiring an unknown executor", () => {
    const registry = new ActionRegistry();

    expect(() => registry.require("PROJECT")).toThrow(
      "No AI action handler registered for 'PROJECT'.",
    );
  });
});
