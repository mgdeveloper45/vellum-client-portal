import { isValidMoneyAmount, normalizeMoneyAmount } from "@/lib/money";
import type {
  DepositPaymentRepository,
  PaymentMethod,
} from "./deposit-payment-repository";

export interface RecordDepositPaymentRequest {
  depositId: string;

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
      reason: "INVALID_DEPOSIT" | "INVALID_AMOUNT" | "NOT_FOUND";

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

    const payment = await depositPaymentRepository.create({
      depositId,
      amount: normalizeMoneyAmount(request.amount),
      paymentMethod: request.paymentMethod,
      notes: request.notes.trim(),
    });

    return {
      success: true,
      paymentId: payment.id,
    };
  };
}

export type RecordDepositPaymentService = ReturnType<
  typeof createRecordDepositPaymentService
>;
