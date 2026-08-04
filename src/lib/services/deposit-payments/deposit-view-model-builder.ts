import { buildDepositFinancialSummary } from "./financial-engine";

import type { DepositViewModel } from "./deposit-view-model";

import type { DepositSummaryRecord } from "@/lib/services/deposits/deposit-repository";

import type { DepositPaymentRecord } from "./deposit-payment-repository";

export function buildDepositViewModel({
  deposit,
  payments,
}: {
  deposit: DepositSummaryRecord;

  payments: DepositPaymentRecord[];
}): DepositViewModel {
  return {
    id: deposit.id,

    amount: deposit.amount,

    status: deposit.status,

    dueDate: deposit.dueDate,

    requestedAt: deposit.requestedAt,

    financialSummary: buildDepositFinancialSummary({
      depositAmount: deposit.amount,

      payments,
    }),

    payments,
  };
}
