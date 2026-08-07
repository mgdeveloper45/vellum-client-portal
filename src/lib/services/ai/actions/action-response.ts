import type { AiActionType } from "./action";
import type { Citation } from "../citations/citation";

export interface ActionResponse {
  success: boolean;

  message: string;

  action: AiActionType;

  requiresConfirmation: boolean;

  citations: Citation[];
}
