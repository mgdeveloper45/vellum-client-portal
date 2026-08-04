import type {
  DepositPaymentRecord,
  DepositPaymentRepository,
} from "./deposit-payment-repository";

export interface GetDepositPaymentsRequest {
  depositId: string;
}

export interface GetDepositPaymentsResult {
  success: boolean;
  payments: DepositPaymentRecord[];
}

interface Dependencies {
  depositPaymentRepository: DepositPaymentRepository;
}

export function createGetDepositPaymentsService({
  depositPaymentRepository,
}: Dependencies) {
  return async function getDepositPayments(
    request: GetDepositPaymentsRequest,
  ): Promise<GetDepositPaymentsResult> {
    const depositId = request.depositId.trim();

    if (!depositId) {
      return {
        success: false,
        payments: [],
      };
    }

    const payments = await depositPaymentRepository.listByDeposit(depositId);

    return {
      success: true,
      payments,
    };
  };
}

export type GetDepositPaymentsService = ReturnType<
  typeof createGetDepositPaymentsService
>;
