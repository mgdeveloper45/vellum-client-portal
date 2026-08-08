import { describe, expect, it } from "vitest";

import { buildActionCard } from "../action-card-builder";

describe("buildActionCard", () => {
  it("creates a card from a successful action", () => {
    const card = buildActionCard({
      success: true,
      message: "Email drafted.",
      title: "Invoice Reminder",
      content: "Draft email body.",
      metadata: {
        action: "EMAIL",
      },
    });

    expect(card).toEqual({
      title: "Invoice Reminder",
      subtitle: "Email drafted.",
      content: "Draft email body.",
      actions: ["Copy", "Edit"],
      metadata: {
        action: "EMAIL",
      },
    });
  });

  it("returns null for failed actions", () => {
    expect(
      buildActionCard({
        success: false,
        message: "Failed.",
      }),
    ).toBeNull();
  });
});
