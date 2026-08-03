import type {
  DepositRepository,
  PaymentMethod,
  DepositStatus,
} from "./deposit-repository";

import { isValidMoneyAmount, normalizeMoneyAmount } from "@/lib/money";

export interface UpdateDepositRequest {
  depositId: string;
  amount: number;
  dueDate: Date | null;
  notes: string;
  status: DepositStatus;
  paymentMethod: PaymentMethod | null;
  paidAt: Date | null;
}

export type UpdateDepositResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: "INVALID_DEPOSIT" | "INVALID_AMOUNT" | "NOT_FOUND";
      message: string;
    };

interface UpdateDepositServiceDependencies {
  depositRepository: DepositRepository;
}

export function createUpdateDepositService({
  depositRepository,
}: UpdateDepositServiceDependencies) {
  return async function updateDeposit(
    request: UpdateDepositRequest,
  ): Promise<UpdateDepositResult> {
    const depositId = request.depositId.trim();

    if (!depositId) {
      return {
        success: false,
        reason: "INVALID_DEPOSIT",
        message: "Deposit is required.",
      };
    }

    if (!isValidMoneyAmount(request.amount)) {
      return {
        success: false,
        reason: "INVALID_AMOUNT",
        message: "Amount must be greater than zero.",
      };
    }

    const updated = await depositRepository.update({
      depositId,
      amount: normalizeMoneyAmount(request.amount),
      dueDate: request.dueDate,
      notes: request.notes.trim(),
      status: request.status,
      paymentMethod: request.paymentMethod,
      paidAt: request.paidAt,
    });

    if (!updated) {
      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Deposit not found.",
      };
    }

    return {
      success: true,
    };
  };
}

export type UpdateDepositService = ReturnType<
  typeof createUpdateDepositService
>;
