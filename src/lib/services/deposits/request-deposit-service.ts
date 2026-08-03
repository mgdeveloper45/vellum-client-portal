import type { DepositRepository } from "./deposit-repository";
import {
    isValidMoneyAmount,
    normalizeMoneyAmount,
} from "@/lib/money";


export interface RequestDepositRequest {
  projectId: string;
  amount: number;
  dueDate: Date | null;
  notes: string;
}

export type RequestDepositResult =
  | {
      success: true;
      depositId: string;
    }
  | {
      success: false;
      reason: "INVALID_PROJECT" | "INVALID_AMOUNT";
      message: string;
    };

export interface RequestDepositServiceDependencies {
  depositRepository: DepositRepository;
}

export function createRequestDepositService({
  depositRepository,
}: RequestDepositServiceDependencies) {
  return async function requestDeposit(
    request: RequestDepositRequest,
  ): Promise<RequestDepositResult> {
    const projectId = request.projectId.trim();

    if (!projectId) {
      return {
        success: false,
        reason: "INVALID_PROJECT",
        message: "A project is required.",
      };
    }

    if (!isValidMoneyAmount(request.amount)) {
      return {
        success: false,
        reason: "INVALID_AMOUNT",
        message: "Deposit amount must be greater than zero.",
      };
    }

    const deposit = await depositRepository.create({
      projectId,
      amount: normalizeMoneyAmount(request.amount),
      dueDate: request.dueDate,
      notes: request.notes.trim(),
      status: "REQUESTED",
    });

    return {
      success: true,
      depositId: deposit.id,
    };
  };
}

export type RequestDepositService = ReturnType<
  typeof createRequestDepositService
>;
