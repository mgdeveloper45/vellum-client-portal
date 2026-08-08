import type { AiActionType } from "./action";

export type ActionPolicy = "AUTOMATIC" | "CONFIRMATION_REQUIRED";

export function getActionPolicy(type: AiActionType): ActionPolicy {
  switch (type) {
    case "NONE":
      return "AUTOMATIC";

    case "CREATE_TASK":
      return "AUTOMATIC";

    case "DRAFT_EMAIL":
      return "AUTOMATIC";

    case "CREATE_BOOKING":
    case "UPDATE_PROJECT":
      return "CONFIRMATION_REQUIRED";
  }
}
