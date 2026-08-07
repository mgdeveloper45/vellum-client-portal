import type { Citation } from "../citations/citation";

import type { AiActionType } from "./action";
import type { ActionResponse } from "./action-response";

export function buildActionResponse(
  action: AiActionType,
  success: boolean,
  message: string,
  requiresConfirmation = false,
  citations: Citation[] = [],
): ActionResponse {
  return {
    success,

    message,

    action,

    requiresConfirmation,

    citations,
  };
}
