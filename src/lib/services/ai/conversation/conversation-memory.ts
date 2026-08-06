import type { ConversationMessage } from "./conversation-message";
import { ConversationHistory } from "./conversation-history";

export class ConversationMemory {
  constructor(
    private readonly history: ConversationHistory = new ConversationHistory(),
  ) {}

  addUserMessage(id: string, content: string) {
    this.history.addUserMessage(id, content);
  }

  addAssistantMessage(id: string, content: string) {
    this.history.addAssistantMessage(id, content);
  }

  addSystemMessage(id: string, content: string) {
    this.history.addSystemMessage(id, content);
  }

  messages(): readonly ConversationMessage[] {
    return this.history.messages();
  }

  lastMessage(): ConversationMessage | null {
    return this.history.lastMessage();
  }

  previousUserQuestion(): ConversationMessage | null {
    const messages = [...this.history.messages()].reverse();

    return messages.find((message) => message.role === "USER") ?? null;
  }

  previousAssistantResponse(): ConversationMessage | null {
    const messages = [...this.history.messages()].reverse();

    return messages.find((message) => message.role === "ASSISTANT") ?? null;
  }

  hasConversation(): boolean {
    return this.history.size() > 0;
  }

  clear() {
    this.history.clear();
  }
}
