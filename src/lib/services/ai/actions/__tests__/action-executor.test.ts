import { describe, expect, it, vi } from "vitest";

import { executeAction } from "../action-executor";
import { ActionRegistry } from "../action-registry";

describe("executeAction", () => {
  it("executes an email action", async () => {
    const registry = new ActionRegistry();

    const execute = vi.fn().mockResolvedValue({
      success: true,
      message: "Invoice reminder drafted.",
    });

    registry.register("DRAFT_EMAIL", {
      execute,
    });

    const result = await executeAction(
      {
        type: "DRAFT_EMAIL",
        confidence: 95,
        explanation: "",
      },
      registry,
    );

    expect(execute).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      success: true,
      message: "Invoice reminder drafted.",
    });
  });

  it("executes a booking action", async () => {
    const registry = new ActionRegistry();

    const execute = vi.fn().mockResolvedValue({
      success: true,
      message: "Booking created.",
    });

    registry.register("CREATE_BOOKING", {
      execute,
    });

    const result = await executeAction(
      {
        type: "CREATE_BOOKING",
        confidence: 90,
        explanation: "",
      },
      registry,
    );

    expect(execute).toHaveBeenCalledTimes(1);

    expect(result.success).toBe(true);
  });

  it("executes a task action", async () => {
    const registry = new ActionRegistry();

    const execute = vi.fn().mockResolvedValue({
      success: true,
      message: "Task created.",
    });

    registry.register("CREATE_TASK", {
      execute,
    });

    const result = await executeAction(
      {
        type: "CREATE_TASK",
        confidence: 90,
        explanation: "",
      },
      registry,
    );

    expect(execute).toHaveBeenCalledTimes(1);

    expect(result.success).toBe(true);
  });

  it("returns a failure when no handler is registered", async () => {
    const registry = new ActionRegistry();

    const result = await executeAction(
      {
        type: "NONE",
        confidence: 100,
        explanation: "",
      },
      registry,
    );

    expect(result).toEqual({
      success: false,
      message: "No handler registered for NONE.",
    });
  });
});
