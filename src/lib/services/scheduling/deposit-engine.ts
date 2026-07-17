import { BookingRule, BookingRuleContext } from "./booking-rules";

export interface DepositCalculationResult {
  required: boolean;

  amount: number;

  percentage?: number;

  reason: string;
}

export function calculateDeposit(
  rules: BookingRule[],
  context: BookingRuleContext,
  servicePrice: number,
): DepositCalculationResult {
  const applicableRules = rules.filter((rule) => rule.enabled);

  const depositRule = applicableRules.find(
    (rule) => rule.type === "REQUIRE_DEPOSIT",
  );

  if (!depositRule) {
    return {
      required: false,
      amount: 0,
      reason: "No deposit required",
    };
  }

  if (typeof depositRule.value === "number") {
    return {
      required: true,
      amount: depositRule.value,
      reason: "Fixed deposit",
    };
  }

  if (
    typeof depositRule.value === "string" &&
    depositRule.value.endsWith("%")
  ) {
    const percentage = Number(depositRule.value.replace("%", ""));

    return {
      required: true,
      percentage,
      amount: Math.round(servicePrice * percentage) / 100,
      reason: `${percentage}% deposit`,
    };
  }

  return {
    required: true,
    amount: servicePrice,
    reason: "Full payment required",
  };
}
