import { prisma } from "../../prisma";

import type {
  CreateDepositRecordInput,
  DepositRepository,
  DepositSummaryRecord,
  UpdateDepositRecordInput,
} from "./deposit-repository";

export const prismaDepositRepository: DepositRepository = {
  async create(input: CreateDepositRecordInput): Promise<{ id: string }> {
    return prisma.deposit.create({
      data: {
        projectId: input.projectId,
        amount: input.amount,
        status: input.status,
        dueDate: input.dueDate,
        notes: input.notes,
      },
      select: {
        id: true,
      },
    });
  },

  async update(input: UpdateDepositRecordInput): Promise<boolean> {
    const result = await prisma.deposit.updateMany({
      where: {
        id: input.depositId,
      },
      data: {
        amount: input.amount,
        status: input.status,
        dueDate: input.dueDate,
        notes: input.notes,
        paymentMethod: input.paymentMethod,
        paidAt: input.paidAt,
      },
    });

    return result.count > 0;
  },

  async listByProject(projectId: string): Promise<DepositSummaryRecord[]> {
    const deposits = await prisma.deposit.findMany({
      where: {
        projectId,
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    return deposits.map((deposit) => ({
      id: deposit.id,
      amount: Number(deposit.amount),
      status: deposit.status,
      projectId: deposit.projectId,
      dueDate: deposit.dueDate,
      requestedAt: deposit.requestedAt,
      paidAt: deposit.paidAt,
    }));
  },
};
