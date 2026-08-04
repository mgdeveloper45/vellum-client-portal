import { prisma } from "../../prisma";

import type {
  CreateDepositRecordInput,
  DepositFinancialRecord,
  DepositStatus,
  DepositEditRecord,
  DepositRepository,
  DepositSummaryRecord,
  FindDepositInput,
  MarkDepositPaidInput,
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

  async markPaid(input: MarkDepositPaidInput): Promise<boolean> {
    const result = await prisma.deposit.updateMany({
      where: {
        id: input.depositId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    return result.count > 0;
  },

  async findForEdit(
    input: FindDepositInput,
  ): Promise<DepositEditRecord | null> {
    const deposit = await prisma.deposit.findFirst({
      where: {
        id: input.depositId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        projectId: true,
        amount: true,
        status: true,
        dueDate: true,
        notes: true,
        paymentMethod: true,
        paidAt: true,
      },
    });

    if (!deposit) {
      return null;
    }

    return {
      id: deposit.id,
      projectId: deposit.projectId,
      amount: Number(deposit.amount),
      status: deposit.status,
      dueDate: deposit.dueDate,
      notes: deposit.notes ?? "",
      paymentMethod: deposit.paymentMethod,
      paidAt: deposit.paidAt,
    };
  },

  async findFinancialRecord(
    depositId: string,
  ): Promise<DepositFinancialRecord | null> {
    const deposit = await prisma.deposit.findUnique({
      where: {
        id: depositId,
      },
      select: {
        id: true,
        amount: true,
        status: true,
      },
    });

    if (!deposit) {
      return null;
    }

    return {
      id: deposit.id,
      amount: Number(deposit.amount),
      status: deposit.status,
    };
  },

async updateStatus(
  depositId: string,
  status: DepositStatus,
): Promise<boolean> {
  const result =
    await prisma.deposit.updateMany({
      where: {
        id: depositId,
      },
      data: {
        status,
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
