import type {
  DepositEditRecord,
  DepositRepository,
} from "./deposit-repository";

export interface GetDepositForEditRequest {
  workspaceId: string;
  depositId: string;
}

export type GetDepositForEditResult =
  | {
      success: true;
      deposit: DepositEditRecord;
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_DEPOSIT" | "NOT_FOUND";
      message: string;
    };

interface GetDepositForEditServiceDependencies {
  depositRepository: DepositRepository;
}

export function createGetDepositForEditService({
  depositRepository,
}: GetDepositForEditServiceDependencies) {
  return async function getDepositForEdit(
    request: GetDepositForEditRequest,
  ): Promise<GetDepositForEditResult> {
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

    const deposit = await depositRepository.findForEdit({
      workspaceId,
      depositId,
    });

    if (!deposit) {
      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Deposit not found.",
      };
    }

    return {
      success: true,
      deposit,
    };
  };
}

export type GetDepositForEditService = ReturnType<
  typeof createGetDepositForEditService
>;
