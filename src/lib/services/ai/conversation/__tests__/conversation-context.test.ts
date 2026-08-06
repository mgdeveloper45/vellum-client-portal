import { describe, expect, it } from "vitest";

import { ConversationContext } from "../conversation-context";
import { ConversationMemory } from "../conversation-memory";

describe("ConversationContext", () => {
  it("recognizes follow-up questions", () => {
    const context = new ConversationContext(new ConversationMemory());

    expect(context.isFollowUpQuestion("Why?")).toBe(true);

    expect(context.isFollowUpQuestion("Explain that")).toBe(true);

    expect(context.isFollowUpQuestion("Tell me more")).toBe(true);

    expect(context.isFollowUpQuestion("What about next week?")).toBe(true);
  });

  it("does not classify a new question as follow-up", () => {
    const context = new ConversationContext(new ConversationMemory());

    expect(context.isFollowUpQuestion("How much revenue did I collect?")).toBe(
      false,
    );
  });

  it("returns previous conversation", () => {
    const memory = new ConversationMemory();

    memory.addUserMessage("1", "How is revenue?");

    memory.addAssistantMessage("2", "Revenue is healthy.");

    const context = new ConversationContext(memory);

    expect(context.previousQuestion()?.content).toBe("How is revenue?");

    expect(context.previousAnswer()?.content).toBe("Revenue is healthy.");
  });

  it("limits prompt history", () => {
    const memory = new ConversationMemory();

    for (let i = 0; i < 20; i++) {
      memory.addUserMessage(`${i}`, `Question ${i}`);
    }

    const context = new ConversationContext(memory);

    expect(context.buildPromptHistory()).toHaveLength(10);
  });

  it("summarizes conversation", () => {
    const memory = new ConversationMemory();

    memory.addUserMessage("1", "Question");

    memory.addAssistantMessage("2", "Answer");

    const context = new ConversationContext(memory);

    expect(context.conversationSummary()).toEqual({
      messageCount: 2,
      hasConversation: true,
      lastQuestion: "Question",
      lastAnswer: "Answer",
    });
  });

  it("returns an empty summary for a new conversation", () => {
    const context = new ConversationContext(new ConversationMemory());

    expect(context.conversationSummary()).toEqual({
      messageCount: 0,
      hasConversation: false,
      lastQuestion: null,
      lastAnswer: null,
    });
  });
});
