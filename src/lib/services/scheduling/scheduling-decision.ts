import type { AvailabilityResult } from "./availability-engine";
import type { DepositCalculationResult } from "./deposit-engine";

export interface SchedulingDecision {
  allowed: boolean;
  reasons: string[];
  warnings: string[];

  availability?: AvailabilityResult;
  deposit?: DepositCalculationResult;
}

export function createSchedulingDecision(): SchedulingDecision {
  return {
    allowed: true,
    reasons: [],
    warnings: [],
  };
}
