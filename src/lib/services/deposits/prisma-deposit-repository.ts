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

  async findFinancialRecord(input): Promise<DepositFinancialRecord | null> {
    const deposit = await prisma.deposit.findFirst({
      where: {
        id: input.depositId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        amount: true,
        status: true,
        projectId: true,
        project: {
          select: {
            name: true,
            ownerId: true,
          },
        },
      },
    });

    if (!deposit) {
      return null;
    }

    return {
      id: deposit.id,
      amount: Number(deposit.amount),
      status: deposit.status,
      projectId: deposit.projectId,
      project: {
        name: deposit.project.name,
        ownerId: deposit.project.ownerId,
      },
    };
  },

  async synchronizeFinancialStatus(input): Promise<boolean> {
    return prisma.$transaction(async (transaction) => {
      if (input.status === "PAID") {
        const transitionResult = await transaction.deposit.updateMany({
          where: {
            id: input.depositId,
            status: {
              not: "PAID",
            },
          },
          data: {
            status: "PAID",
            paidAt: input.paidAt,
          },
        });

        if (transitionResult.count > 0) {
          await transaction.notification.create({
            data: {
              userId: input.ownerId,
              title: "Deposit paid",
              message: `Deposit for ${input.projectName} was paid in full.`,
              type: "DEPOSIT",
              href: `/projects/${input.projectId}`,
            },
          });

          return true;
        }

        const alreadyPaidDeposit = await transaction.deposit.findFirst({
          where: {
            id: input.depositId,
            status: "PAID",
          },
          select: {
            id: true,
          },
        });

        return alreadyPaidDeposit !== null;
      }

      const result = await transaction.deposit.updateMany({
        where: {
          id: input.depositId,
        },
        data: {
          status: input.status,
          paidAt: null,
        },
      });

      return result.count > 0;
    });
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
