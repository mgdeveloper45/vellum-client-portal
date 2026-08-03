import { prismaDepositPaymentRepository } from "../prisma-deposit-payment-repository";
import { createRecordDepositPaymentService } from "../record-deposit-payment-service";

export const recordDepositPaymentService = createRecordDepositPaymentService({
  depositPaymentRepository: prismaDepositPaymentRepository,
});
