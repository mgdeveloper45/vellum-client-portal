import type { ToolId } from "./tool-id";

export interface ToolPlan {
  tool: ToolId | null;

  requiresConfirmation: boolean;
}