import { describe, expect, it, vi } from "vitest";

import { executeAction } from "../action-executor";
import { ActionRegistry } from "../action-registry";

describe("executeAction", () => {
  it("executes an email action", async () => {
    const registry = new ActionRegistry();

    const execute = vi.fn().mockResolvedValue({
      success: true,
      message: "Invoice reminder drafted.",
      title: "Invoice Reminder",
      content: "Draft email body.",
      metadata: {
        action: "EMAIL",
      },
    });

    registry.register("EMAIL", {
      execute,
    });

    const result = await executeAction(
      {
        type: "DRAFT_EMAIL",
        executor: "EMAIL",
        confidence: 95,
        explanation: "",
      },
      registry,
    );

    expect(execute).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      success: true,
      message: "Invoice reminder drafted.",
      title: "Invoice Reminder",
      content: "Draft email body.",
      metadata: {
        action: "EMAIL",
      },
    });

    expect(result.title).toBe("Invoice Reminder");
    expect(result.content).toContain("Draft");
    expect(result.metadata).toEqual({
      action: "EMAIL",
    });
  });

  it("executes a booking action", async () => {
    const registry = new ActionRegistry();

    const execute = vi.fn().mockResolvedValue({
      success: true,
      message: "Booking created.",
      title: "Booking Confirmation",
      content: "Booking confirmation email.",
      metadata: {
        action: "BOOKING",
      },
    });

    registry.register("BOOKING", {
      execute,
    });

    const result = await executeAction(
      {
        type: "CREATE_BOOKING",
        executor: "BOOKING",
        confidence: 90,
        explanation: "",
      },
      registry,
    );

    expect(execute).toHaveBeenCalledTimes(1);

    expect(result.success).toBe(true);
    expect(result.title).toBe("Booking Confirmation");
    expect(result.metadata).toEqual({
      action: "BOOKING",
    });
  });

  it("executes a task action", async () => {
    const registry = new ActionRegistry();

    const execute = vi.fn().mockResolvedValue({
      success: true,
      message: "Task created.",
      title: "Follow-up Task",
      content: "Call client tomorrow.",
      metadata: {
        action: "TASK",
      },
    });

    registry.register("TASK", {
      execute,
    });

    const result = await executeAction(
      {
        type: "CREATE_TASK",
        executor: "TASK",
        confidence: 90,
        explanation: "",
      },
      registry,
    );

    expect(execute).toHaveBeenCalledTimes(1);

    expect(result.success).toBe(true);
    expect(result.title).toBe("Follow-up Task");
    expect(result.metadata).toEqual({
      action: "TASK",
    });
  });

  it("returns a failure when no executable action exists", async () => {
    const registry = new ActionRegistry();

    const result = await executeAction(
      {
        type: "NONE",
        executor: null,
        confidence: 100,
        explanation: "",
      },
      registry,
    );

    expect(result).toEqual({
      success: false,
      message: "No executable action was planned.",
    });
  });

  it("returns a failure when no handler is registered", async () => {
    const registry = new ActionRegistry();

    const result = await executeAction(
      {
        type: "DRAFT_EMAIL",
        executor: "EMAIL",
        confidence: 95,
        explanation: "",
      },
      registry,
    );

    expect(result).toEqual({
      success: false,
      message: "No handler registered for EMAIL.",
    });
  });
});
