import { describe, expect, it } from "vitest";

import { createConversationMessage } from "../conversation-message";

describe("createConversationMessage", () => {
  it("creates a conversation message", () => {
    const createdAt = new Date("2026-08-01T09:00:00Z");

    const message = createConversationMessage({
      id: "message-1",
      role: "USER",
      content: "How is revenue?",
      createdAt,
    });

    expect(message).toEqual({
      id: "message-1",
      role: "USER",
      content: "How is revenue?",
      createdAt,
    });
  });

  it("uses the current time when createdAt is omitted", () => {
    const message = createConversationMessage({
      id: "message-2",
      role: "ASSISTANT",
      content: "Revenue is healthy.",
    });

    expect(message.createdAt).toBeInstanceOf(Date);
  });
});
