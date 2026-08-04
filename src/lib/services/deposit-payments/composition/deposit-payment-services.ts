import { prismaDepositPaymentRepository } from "../prisma-deposit-payment-repository";
import { createRecordDepositPaymentService } from "../record-deposit-payment-service";
import { prismaDepositRepository } from "@/lib/services/deposits/prisma-deposit-repository";
import { createGetDepositPaymentsService } from "../get-deposit-payments-service";
import { createGetDepositPaymentForEditService } from "../get-deposit-payment-for-edit-service";
import { createUpdateDepositPaymentService } from "../update-deposit-payment-service";

export const recordDepositPaymentService = createRecordDepositPaymentService({
  depositRepository: prismaDepositRepository,

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
