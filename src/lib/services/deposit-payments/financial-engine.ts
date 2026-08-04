import type { DepositStatus } from "@/lib/services/deposits/deposit-repository";
import type { DepositPaymentRecord } from "./deposit-payment-repository";
import type {
  DepositFinancialSummary,
} from "./deposit-view-model";

export function buildDepositFinancialSummary({
  depositAmount,
  payments,
}: {
  depositAmount: number;

  payments: DepositPaymentRecord[];
}): DepositFinancialSummary {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const remainingBalance = Math.max(0, depositAmount - totalPaid);

  const percentPaid =
    depositAmount <= 0
      ? 0
      : Math.min(100, Math.round((totalPaid / depositAmount) * 100));

  let status: DepositStatus = "REQUESTED";

  if (totalPaid > 0 && remainingBalance > 0) {
    status = "PARTIALLY_PAID";
  }

  if (remainingBalance === 0) {
    status = "PAID";
  }

  return {
    totalPaid,

    remainingBalance,

    percentPaid,

    status,

    isPaid: status === "PAID",

    isPartiallyPaid: status === "PARTIALLY_PAID",

    isOutstanding: remainingBalance > 0,
  };
}
