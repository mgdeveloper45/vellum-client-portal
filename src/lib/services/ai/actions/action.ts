export type AiActionType =
  "NONE" | "DRAFT_EMAIL" | "CREATE_BOOKING" | "UPDATE_PROJECT";

export type AiActionExecutor = "EMAIL" | "BOOKING" | "PROJECT";

export interface AiAction {
  type: AiActionType;
  executor: AiActionExecutor | null;
  confidence: number;
  explanation: string;
}
