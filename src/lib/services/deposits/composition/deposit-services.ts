import { prismaDepositRepository } from "../prisma-deposit-repository";
import { createRequestDepositService } from "../request-deposit-service";

export const requestDepositService =
    createRequestDepositService({
        depositRepository:
            prismaDepositRepository,
    });