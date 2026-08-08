export type AiActionType = "EMAIL" | "INVOICE" | "BOOKING" | "PROPOSAL";

export interface AiActionResult {
  title: string;
  content: string;
}
