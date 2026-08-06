import {
  createConversationMessage,
  type ConversationMessage,
} from "./conversation-message";

export class ConversationHistory {
  private readonly history: ConversationMessage[] = [];

  addUserMessage(id: string, content: string) {
    this.history.push(
      createConversationMessage({
        id,
        role: "USER",
        content,
      }),
    );
  }

  addAssistantMessage(id: string, content: string) {
    this.history.push(
      createConversationMessage({
        id,
        role: "ASSISTANT",
        content,
      }),
    );
  }

  addSystemMessage(id: string, content: string) {
    this.history.push(
      createConversationMessage({
        id,
        role: "SYSTEM",
        content,
      }),
    );
  }

  messages(): readonly ConversationMessage[] {
    return [...this.history];
  }

  lastMessage(): ConversationMessage | null {
    return this.history.at(-1) ?? null;
  }

  size(): number {
    return this.history.length;
  }

  clear() {
    this.history.length = 0;
  }
}
