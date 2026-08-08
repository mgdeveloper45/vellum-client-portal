import type { Citation } from "../citations/citation";
import type { AiActionType } from "../actions/action";

export interface CopilotSession {
  id: string;

  history: string[];

  pendingAction?: AiActionType;

  completedActions: AiActionType[];

  citations: Citation[];
}
