import { isValidMoneyAmount, normalizeMoneyAmount } from "@/lib/money";
import type {
  DepositPaymentRepository,
  PaymentMethod,
} from "./deposit-payment-repository";
import { buildDepositFinancialSummary } from "./financial-engine";
import type { DepositRepository } from "@/lib/services/deposits/deposit-repository";

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
  depositRepository: DepositRepository;

  depositPaymentRepository: DepositPaymentRepository;
}

export function createRecordDepositPaymentService({
  depositRepository,
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

    const deposit = await depositRepository.findFinancialRecord(depositId);

    if (!deposit) {
      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Deposit not found.",
      };
    }

    const payments = await depositPaymentRepository.listByDeposit(depositId);

    const financialSummary = buildDepositFinancialSummary({
      depositAmount: deposit.amount,
      payments,
    });

    await depositRepository.updateStatus(depositId, financialSummary.status);

    // TODO:
    // When financialSummary.status becomes "PAID",
    // publish a DEPOSIT_PAID workflow event.

    return {
      success: true,
      paymentId: payment.id,
    };
  };
}

export type RecordDepositPaymentService = ReturnType<
  typeof createRecordDepositPaymentService
>;
