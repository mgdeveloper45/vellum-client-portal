import type { DepositStatus } from "@/lib/services/deposits/deposit-repository";
import type { DepositPaymentRecord } from "./deposit-payment-repository";

export interface DepositFinancialSummary {
  totalPaid: number;

  remainingBalance: number;

  percentPaid: number;

  status: DepositStatus;

  isPaid: boolean;

  isPartiallyPaid: boolean;

  isOutstanding: boolean;
}

export interface DepositViewModel {
  id: string;

  amount: number;

  status: DepositStatus;

  dueDate: Date | null;

  requestedAt: Date;

  financialSummary: DepositFinancialSummary;

  payments: DepositPaymentRecord[];
}
