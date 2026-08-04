import { isValidMoneyAmount, normalizeMoneyAmount } from "@/lib/money";

import type {
  DepositPaymentRepository,
  PaymentMethod,
} from "./deposit-payment-repository";

export interface UpdateDepositPaymentRequest {
  paymentId: string;

  amount: number;

  paymentMethod: PaymentMethod;

  notes: string;
}

export type UpdateDepositPaymentResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: "INVALID_PAYMENT" | "INVALID_AMOUNT";
      message: string;
    };

interface Dependencies {
  depositPaymentRepository: DepositPaymentRepository;
}

export function createUpdateDepositPaymentService({
  depositPaymentRepository,
}: Dependencies) {
  return async function updateDepositPayment(
    request: UpdateDepositPaymentRequest,
  ): Promise<UpdateDepositPaymentResult> {
    const paymentId = request.paymentId.trim();

    if (!paymentId) {
      return {
        success: false,
        reason: "INVALID_PAYMENT",
        message: "Payment is required.",
      };
    }

    if (!isValidMoneyAmount(request.amount)) {
      return {
        success: false,
        reason: "INVALID_AMOUNT",
        message: "Invalid payment amount.",
      };
    }

    const updated = await depositPaymentRepository.update({
      paymentId,

      amount: normalizeMoneyAmount(request.amount),

      paymentMethod: request.paymentMethod,

      notes: request.notes.trim(),
    });

    if (!updated) {
      return {
        success: false,
        reason: "INVALID_PAYMENT",
        message: "Payment not found.",
      };
    }

    return {
      success: true,
    };
  };
}

export type UpdateDepositPaymentService = ReturnType<
  typeof createUpdateDepositPaymentService
>;
