import type {
  DepositPaymentEditRecord,
  DepositPaymentRepository,
} from "./deposit-payment-repository";

export interface GetDepositPaymentForEditRequest {
  workspaceId: string;
  paymentId: string;
}

export type GetDepositPaymentForEditResult =
  | {
      success: true;
      payment: DepositPaymentEditRecord;
    }
  | {
      success: false;
      reason: "INVALID_PAYMENT" | "NOT_FOUND";
      message: string;
    };

interface Dependencies {
  depositPaymentRepository: DepositPaymentRepository;
}

export function createGetDepositPaymentForEditService({
  depositPaymentRepository,
}: Dependencies) {
  return async function getDepositPaymentForEdit(
    request: GetDepositPaymentForEditRequest,
  ): Promise<GetDepositPaymentForEditResult> {
    const paymentId = request.paymentId.trim();

    if (!paymentId) {
      return {
        success: false,
        reason: "INVALID_PAYMENT",
        message: "Payment is required.",
      };
    }

    const payment = await depositPaymentRepository.findForEdit({
      workspaceId: request.workspaceId,
      paymentId,
    });

    if (!payment) {
      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Payment not found.",
      };
    }

    return {
      success: true,
      payment,
    };
  };
}

export type GetDepositPaymentForEditService = ReturnType<
  typeof createGetDepositPaymentForEditService
>;
