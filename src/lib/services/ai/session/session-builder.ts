import type { CopilotSession } from "./session";

export interface SessionIdGenerator {
  (): string;
}

export function createSession(
  generateId: SessionIdGenerator = () => crypto.randomUUID(),
): CopilotSession {
  return {
    id: generateId(),
    history: [],
    completedActions: [],
    citations: [],
  };
}