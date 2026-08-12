import { isValidMoneyAmount, normalizeMoneyAmount } from "@/lib/money";
import type { DepositRepository } from "@/lib/services/deposits/deposit-repository";
import type {
  DepositPaymentRepository,
  PaymentMethod,
} from "./deposit-payment-repository";
import { buildDepositFinancialSummary } from "./financial-engine";

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
      reason: "INVALID_PAYMENT" | "INVALID_AMOUNT" | "NOT_FOUND";
      message: string;
    };

interface Dependencies {
  depositRepository: DepositRepository;
  depositPaymentRepository: DepositPaymentRepository;
}

export function createUpdateDepositPaymentService({
  depositRepository,
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

    const existingPayment =
      await depositPaymentRepository.findForEdit(paymentId);

    if (!existingPayment) {
      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Payment not found.",
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
        reason: "NOT_FOUND",
        message: "Payment not found.",
      };
    }

    const deposit = await depositRepository.findFinancialRecord(
      existingPayment.depositId,
    );

    if (!deposit) {
      return {
        success: false,
        reason: "NOT_FOUND",
        message: "Deposit not found.",
      };
    }

    const payments = await depositPaymentRepository.listByDeposit(
      existingPayment.depositId,
    );

    const financialSummary = buildDepositFinancialSummary({
      depositAmount: deposit.amount,
      payments,
    });

    await depositRepository.updateStatus(
      existingPayment.depositId,
      financialSummary.status,
    );

    return {
      success: true,
    };
  };
}

export type UpdateDepositPaymentService = ReturnType<
  typeof createUpdateDepositPaymentService
>;
