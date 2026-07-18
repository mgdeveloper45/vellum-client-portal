import type { DepositCalculationResult } from "./deposit-engine";

export interface SchedulingDecision {
  allowed: boolean;
  reasons: string[];
  warnings: string[];
  deposit?: DepositCalculationResult;
}

export function createSchedulingDecision(): SchedulingDecision {
  return {
    allowed: true,
    reasons: [],
    warnings: [],
  };
}
