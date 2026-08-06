export type ConversationRole = "SYSTEM" | "USER" | "ASSISTANT";

export interface ConversationMessage {
  id: string;

  role: ConversationRole;

  content: string;

  createdAt: Date;
}

export function createConversationMessage({
  id,
  role,
  content,
  createdAt = new Date(),
}: {
  id: string;
  role: ConversationRole;
  content: string;
  createdAt?: Date;
}): ConversationMessage {
  return {
    id,
    role,
    content,
    createdAt,
  };
}
