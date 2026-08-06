import type { ConversationMessage } from "./conversation-message";
import { ConversationMemory } from "./conversation-memory";

const FOLLOW_UP_PHRASES = [
  "why",
  "why?",
  "explain",
  "explain that",
  "tell me more",
  "more",
  "continue",
  "what about",
  "what about tomorrow",
  "what about next week",
  "compare",
  "compare that",
  "expand",
  "elaborate",
] as const;

export class ConversationContext {
  constructor(private readonly memory: ConversationMemory) {}

  hasConversation(): boolean {
    return this.memory.hasConversation();
  }

  isFollowUpQuestion(question: string): boolean {
    const normalized = question.trim().toLowerCase();

    return FOLLOW_UP_PHRASES.some((phrase) => normalized.startsWith(phrase));
  }

  previousQuestion(): ConversationMessage | null {
    return this.memory.previousUserQuestion();
  }

  previousAnswer(): ConversationMessage | null {
    return this.memory.previousAssistantResponse();
  }

  buildPromptHistory(limit = 10): readonly ConversationMessage[] {
    const messages = this.memory.messages();

    return messages.slice(-limit);
  }

  conversationSummary() {
    return {
      messageCount: this.memory.messages().length,

      hasConversation: this.memory.hasConversation(),

      lastQuestion: this.previousQuestion()?.content ?? null,

      lastAnswer: this.previousAnswer()?.content ?? null,
    };
  }
}
