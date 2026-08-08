import { describe, expect, it } from "vitest";

import { ActionRegistry } from "../action-registry";
import { executeCopilotAction } from "../copilot-action-service";

describe("executeCopilotAction", () => {
  it("returns a rich action card for an executed action", async () => {
    const registry = new ActionRegistry();

    registry.register("EMAIL", {
      execute: async () => ({
        success: true,
        message: "Invoice reminder drafted.",
        title: "Invoice Reminder",
        content: "Hi John, this is a friendly payment reminder.",
        metadata: {
          action: "EMAIL",
          invoiceId: "INV-2041",
        },
      }),
    });

    const result = await executeCopilotAction(
      "What should I do about my invoices?",
      registry,
    );

    expect(result.handled).toBe(true);

    expect(result.message).toBe("Invoice reminder drafted.");

    expect(result.card).toEqual({
      title: "Invoice Reminder",
      subtitle: "Invoice reminder drafted.",
      content: "Hi John, this is a friendly payment reminder.",
      actions: ["Copy", "Edit"],
      metadata: {
        action: "EMAIL",
        invoiceId: "INV-2041",
      },
    });
  });

  it("returns no card when confirmation is required", async () => {
    const registry = new ActionRegistry();

    const result = await executeCopilotAction(
      "What should I do about my bookings?",
      registry,
    );

    expect(result.handled).toBe(false);

    expect(result.message).toContain("Confirmation required");

    expect(result.card).toBeNull();
  });

  it("returns no card when no handler is registered", async () => {
    const registry = new ActionRegistry();

    const result = await executeCopilotAction(
      "What should I do about my invoices?",
      registry,
    );

    expect(result.handled).toBe(false);

    expect(result.message).toContain("No handler");

    expect(result.card).toBeNull();
  });

  it("returns no card for informational questions", async () => {
    const registry = new ActionRegistry();

    const result = await executeCopilotAction(
      "How is my revenue doing?",
      registry,
    );

    expect(result.handled).toBe(false);

    expect(result.card).toBeNull();
  });
});
