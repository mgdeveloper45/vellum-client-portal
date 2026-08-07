import type { AiActionType } from "./action";

export type ActionExecutionPolicy = "AUTOMATIC" | "CONFIRMATION_REQUIRED";

export function getActionPolicy(action: AiActionType): ActionExecutionPolicy {
  switch (action) {
    case "DRAFT_EMAIL":
      return "AUTOMATIC";

    case "NONE":
      return "AUTOMATIC";

    case "CREATE_TASK":
    case "CREATE_BOOKING":
    case "UPDATE_PROJECT":
    case "CREATE_INVOICE":
      return "CONFIRMATION_REQUIRED";
  }
}
