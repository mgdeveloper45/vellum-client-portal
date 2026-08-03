import type { DepositRepository } from "./deposit-repository";

export interface MarkDepositPaidRequest {
  workspaceId: string;
  depositId: string;
}

export type MarkDepositPaidResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_DEPOSIT" | "NOT_FOUND";
      message: string;
    };

interface MarkDepositPaidServiceDependencies {
  depositRepository: DepositRepository;
}

export function createMarkDepositPaidService({
  depositRepository,
}: MarkDepositPaidServiceDependencies) {
  return async function markDepositPaid(
    request: MarkDepositPaidRequest,
  ): Promise<MarkDepositPaidResult> {
    const workspaceId = request.workspaceId.trim();
    const depositId = request.depositId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "Workspace is required.",
      };
    }

    if (!depositId) {
      return {
        success: false,
        reason: "INVALID_DEPOSIT",
        message: "Deposit is required.",
      };
    }

    const updated = await depositRepository.markPaid({
      workspaceId,
      depositId,
    });

    if (!updated) {
      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Deposit was not found for this workspace.",
      };
    }

    return {
      success: true,
    };
  };
}

export type MarkDepositPaidService = ReturnType<
  typeof createMarkDepositPaidService
>;
