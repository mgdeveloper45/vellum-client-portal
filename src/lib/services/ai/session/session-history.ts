import type { CopilotSession } from "./session";

export function addMessage(
  session: CopilotSession,
  message: string,
): CopilotSession {
  return {
    ...session,

    history: [...session.history, message],
  };
}
