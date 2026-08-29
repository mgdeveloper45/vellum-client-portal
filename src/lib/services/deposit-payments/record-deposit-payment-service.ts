import { isValidMoneyAmount, normalizeMoneyAmount } from "@/lib/money";
import type {
  DepositPaymentRepository,
  PaymentMethod,
} from "./deposit-payment-repository";

export interface RecordDepositPaymentRequest {
  workspaceId: string;
  depositId: string;
  operationKey: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
}

export type RecordDepositPaymentResult =
  | {
      success: true;
      paymentId: string;
    }
  | {
      success: false;
      reason:
        | "INVALID_DEPOSIT"
        | "INVALID_AMOUNT"
        | "NOT_FOUND"
        | "IDEMPOTENCY_CONFLICT";
      message: string;
    };

interface RecordDepositPaymentServiceDependencies {
  depositPaymentRepository: DepositPaymentRepository;
}

export function createRecordDepositPaymentService({
  depositPaymentRepository,
}: RecordDepositPaymentServiceDependencies) {
  return async function recordDepositPayment(
    request: RecordDepositPaymentRequest,
  ): Promise<RecordDepositPaymentResult> {
    const depositId = request.depositId.trim();
    const operationKey = request.operationKey.trim();

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
        message: "Payment amount must be greater than zero.",
      };
    }

    const result = await depositPaymentRepository.recordAndSynchronize({
      workspaceId: request.workspaceId,
      depositId,
      operationKey,
      amount: normalizeMoneyAmount(request.amount),
      paymentMethod: request.paymentMethod,
      notes: request.notes.trim(),
    });

    if (!result.success) {
      if (result.reason === "IDEMPOTENCY_CONFLICT") {
        return {
          success: false,
          reason: "IDEMPOTENCY_CONFLICT",
          message: "This payment operation conflicts with an existing payment.",
        };
      }

      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Deposit not found.",
      };
    }

    return {
      success: true,
      paymentId: result.paymentId,
    };
  };
}

export type RecordDepositPaymentService = ReturnType<
  typeof createRecordDepositPaymentService
>;
