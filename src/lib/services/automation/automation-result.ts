export type AutomationActionResult = {
  action: string;
  success: boolean;
  message: string;
};

export type AutomationExecutionResult = {
  executedActions: AutomationActionResult[];
  successfulActions: number;
  failedActions: number;
};
