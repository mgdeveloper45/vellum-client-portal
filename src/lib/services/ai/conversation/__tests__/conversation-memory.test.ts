import { describe, expect, it } from "vitest";

import { ConversationMemory } from "../conversation-memory";

describe("ConversationMemory", () => {
  it("starts empty", () => {
    const memory = new ConversationMemory();

    expect(memory.hasConversation()).toBe(false);

    expect(memory.messages()).toEqual([]);

    expect(memory.lastMessage()).toBeNull();
  });

  it("stores a conversation", () => {
    const memory = new ConversationMemory();

    memory.addUserMessage("1", "How is revenue?");

    memory.addAssistantMessage("2", "Revenue is healthy.");

    expect(memory.hasConversation()).toBe(true);

    expect(memory.messages()).toHaveLength(2);
  });

  it("returns the previous user question", () => {
    const memory = new ConversationMemory();

    memory.addUserMessage("1", "How is revenue?");

    memory.addAssistantMessage("2", "Revenue is healthy.");

    memory.addUserMessage("3", "Why?");

    expect(memory.previousUserQuestion()).toMatchObject({
      content: "Why?",
    });
  });

  it("returns the previous assistant response", () => {
    const memory = new ConversationMemory();

    memory.addUserMessage("1", "How is revenue?");

    memory.addAssistantMessage("2", "Revenue is healthy.");

    expect(memory.previousAssistantResponse()).toMatchObject({
      content: "Revenue is healthy.",
    });
  });

  it("clears conversation history", () => {
    const memory = new ConversationMemory();

    memory.addUserMessage("1", "Question");

    expect(memory.hasConversation()).toBe(true);

    memory.clear();

    expect(memory.hasConversation()).toBe(false);

    expect(memory.messages()).toEqual([]);
  });

  it("returns null when no previous user exists", () => {
    const memory = new ConversationMemory();

    expect(memory.previousUserQuestion()).toBeNull();
  });

  it("returns null when no assistant response exists", () => {
    const memory = new ConversationMemory();

    memory.addUserMessage("1", "Hello");

    expect(memory.previousAssistantResponse()).toBeNull();
  });
});
