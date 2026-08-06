import { describe, expect, it } from "vitest";

import { classifyConversationIntent } from "../conversation-intent";

describe("classifyConversationIntent", () => {
  it("recognizes follow-up questions", () => {
    expect(classifyConversationIntent("Why?")).toBe("FOLLOW_UP");
  });

  it("recognizes clarification requests", () => {
    expect(classifyConversationIntent("Explain that")).toBe("CLARIFICATION");
  });

  it("recognizes comparison questions", () => {
    expect(classifyConversationIntent("Compare this with last week")).toBe(
      "COMPARISON",
    );
  });

  it("recognizes expansion requests", () => {
    expect(classifyConversationIntent("Tell me more")).toBe("EXPANSION");
  });

  it("recognizes action questions", () => {
    expect(classifyConversationIntent("What should I do?")).toBe("ACTION");
  });

  it("recognizes new questions", () => {
    expect(classifyConversationIntent("How much revenue did I collect?")).toBe(
      "NEW_QUESTION",
    );
  });
});
