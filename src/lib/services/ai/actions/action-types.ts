export type AiActionType = "EMAIL" | "INVOICE" | "BOOKING" | "PROPOSAL";

export interface AiActionResult {
  type: AiActionType;
  title: string;
  content: string;
  preview: string;
}
