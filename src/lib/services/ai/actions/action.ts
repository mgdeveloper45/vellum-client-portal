export type AiActionType =
  | "NONE"
  | "DRAFT_EMAIL"
  | "CREATE_TASK"
  | "CREATE_BOOKING"
  | "UPDATE_PROJECT"
  | "CREATE_INVOICE";

export interface AiAction {
  type: AiActionType;

  confidence: number;

  explanation: string;
}
