import { prismaDepositPaymentRepository } from "../prisma-deposit-payment-repository";
import { createRecordDepositPaymentService } from "../record-deposit-payment-service";
import { createGetDepositPaymentsService } from "../get-deposit-payments-service";
import { createGetDepositPaymentForEditService } from "../get-deposit-payment-for-edit-service";
import { createUpdateDepositPaymentService } from "../update-deposit-payment-service";

export const recordDepositPaymentService = createRecordDepositPaymentService({
  depositPaymentRepository: prismaDepositPaymentRepository,
});

export const getDepositPaymentsService = createGetDepositPaymentsService({
  depositPaymentRepository: prismaDepositPaymentRepository,
});

export const getDepositPaymentForEditService =
  createGetDepositPaymentForEditService({
    depositPaymentRepository: prismaDepositPaymentRepository,
  });

export const updateDepositPaymentService = createUpdateDepositPaymentService({
  depositPaymentRepository: prismaDepositPaymentRepository,
});
