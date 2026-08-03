import { prismaDepositRepository } from "../prisma-deposit-repository";

import { createGetDepositForEditService } from "../get-deposit-for-edit-service";
import { createMarkDepositPaidService } from "../mark-deposit-paid-service";
import { createRequestDepositService } from "../request-deposit-service";
import { createUpdateDepositService } from "../update-deposit-service";

export const requestDepositService = createRequestDepositService({
  depositRepository: prismaDepositRepository,
});

export const markDepositPaidService = createMarkDepositPaidService({
  depositRepository: prismaDepositRepository,
});

export const getDepositForEditService = createGetDepositForEditService({
  depositRepository: prismaDepositRepository,
});

export const updateDepositService = createUpdateDepositService({
  depositRepository: prismaDepositRepository,
});
