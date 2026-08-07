import type { AiActionType } from "./action";

export interface ActionConfirmation {
  requiresConfirmation: boolean;

  action: AiActionType;

  title: string;

  message: string;
}

export function buildActionConfirmation(
  action: AiActionType,
): ActionConfirmation {
  return {
    requiresConfirmation: true,

    action,

    title: action
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),

    message: `I can perform the action "${action}". Would you like me to continue?`,
  };
}
