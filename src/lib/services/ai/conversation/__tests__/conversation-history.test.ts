import { describe, expect, it } from "vitest";
import type { ConversationMessage } from "../conversation-message";
import { ConversationHistory } from "../conversation-history";

describe("ConversationHistory", () => {
  it("starts empty", () => {
    const history = new ConversationHistory();

    expect(history.size()).toBe(0);
    expect(history.messages()).toEqual([]);
    expect(history.lastMessage()).toBeNull();
  });

  it("adds user messages", () => {
    const history = new ConversationHistory();

    history.addUserMessage("1", "How is revenue?");

    expect(history.size()).toBe(1);

    expect(history.lastMessage()).toMatchObject({
      role: "USER",
      content: "How is revenue?",
    });
  });

  it("adds assistant messages", () => {
    const history = new ConversationHistory();

    history.addAssistantMessage("2", "Revenue is healthy.");

    expect(history.size()).toBe(1);

    expect(history.lastMessage()).toMatchObject({
      role: "ASSISTANT",
      content: "Revenue is healthy.",
    });
  });

  it("adds system messages", () => {
    const history = new ConversationHistory();

    history.addSystemMessage("3", "System initialized.");

    expect(history.lastMessage()).toMatchObject({
      role: "SYSTEM",
    });
  });

  it("returns messages in order", () => {
    const history = new ConversationHistory();

    history.addUserMessage("1", "Question");

    history.addAssistantMessage("2", "Answer");

    expect(history.messages().map((message) => message.role)).toEqual([
      "USER",
      "ASSISTANT",
    ]);
  });

  it("clears the history", () => {
    const history = new ConversationHistory();

    history.addUserMessage("1", "Question");

    history.addAssistantMessage("2", "Answer");

    expect(history.size()).toBe(2);

    history.clear();

    expect(history.size()).toBe(0);
    expect(history.messages()).toEqual([]);
    expect(history.lastMessage()).toBeNull();
  });

  it("returns a defensive copy of the messages", () => {
    const history = new ConversationHistory();

    history.addUserMessage("1", "Question");

    const messages = history.messages();

    expect(messages).toHaveLength(1);

    (messages as ConversationMessage[]).push({
      id: "999",
      role: "USER",
      content: "Injected",
      createdAt: new Date(),
    });

    expect(history.size()).toBe(1);
  });
});
