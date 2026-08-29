import { prisma } from "@/lib/prisma";

import type {
  DepositPaymentRecord,
  DepositPaymentRepository,
  RecordAndSynchronizeDepositPaymentResult,
  UpdateAndSynchronizeDepositPaymentResult,
  DepositPaymentEditRecord,
  UpdateDepositPaymentInput,
} from "./deposit-payment-repository";

const SERIALIZABLE_TRANSACTION_MAX_ATTEMPTS = 3;

function isRetryableTransactionConflict(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as Error & { code?: unknown }).code === "P2034"
  );
}

async function retrySerializableTransaction<T>(
  operation: () => Promise<T>,
): Promise<T> {
  let attempt = 0;

  while (attempt < SERIALIZABLE_TRANSACTION_MAX_ATTEMPTS) {
    attempt += 1;

    try {
      return await operation();
    } catch (error) {
      if (
        !isRetryableTransactionConflict(error) ||
        attempt >= SERIALIZABLE_TRANSACTION_MAX_ATTEMPTS
      ) {
        throw error;
      }
    }
  }

  throw new Error("Serializable transaction retry loop exhausted.");
}

export const prismaDepositPaymentRepository: DepositPaymentRepository = {
  async recordAndSynchronize(
    input,
  ): Promise<RecordAndSynchronizeDepositPaymentResult> {
    return retrySerializableTransaction(() =>
      prisma.$transaction(async (transaction) => {
      const deposit = await transaction.deposit.findFirst({
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
        return {
          success: false,
          reason: "NOT_FOUND",
        };
      }

      const claim = await transaction.depositPayment.createMany({
        data: {
          depositId: deposit.id,
          operationKey: input.operationKey,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          notes: input.notes,
        },
        skipDuplicates: true,
      });

      const payment = await transaction.depositPayment.findUnique({
        where: {
          operationKey: input.operationKey,
        },
        select: {
          id: true,
          depositId: true,
          amount: true,
          paymentMethod: true,
          notes: true,
          deposit: {
            select: {
              project: {
                select: {
                  workspaceId: true,
                },
              },
            },
          },
        },
      });

      if (!payment) {
        throw new Error(
          "Deposit payment operation was claimed but could not be loaded.",
        );
      }

      if (claim.count === 0) {
        const isExactReplay =
          payment.depositId === deposit.id &&
          payment.deposit.project.workspaceId === input.workspaceId &&
          Number(payment.amount) === input.amount &&
          payment.paymentMethod === input.paymentMethod &&
          (payment.notes ?? "") === input.notes;

        if (!isExactReplay) {
          return {
            success: false,
            reason: "IDEMPOTENCY_CONFLICT",
          };
        }

        return {
          success: true,
          paymentId: payment.id,
        };
      }

      const aggregate = await transaction.depositPayment.aggregate({
        where: {
          depositId: deposit.id,
        },
        _sum: {
          amount: true,
        },
      });

      const totalPaid = Number(aggregate._sum.amount ?? 0);
      const depositAmount = Number(deposit.amount);

      const status =
        totalPaid >= depositAmount
          ? "PAID"
          : totalPaid > 0
            ? "PARTIALLY_PAID"
            : "REQUESTED";

      if (status === "PAID") {
        const transitionResult = await transaction.deposit.updateMany({
          where: {
            id: deposit.id,
            status: {
              not: "PAID",
            },
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        if (transitionResult.count > 0) {
          await transaction.notification.create({
            data: {
              userId: deposit.project.ownerId,
              title: "Deposit paid",
              message: `Deposit for ${deposit.project.name} was paid in full.`,
              type: "DEPOSIT",
              href: `/projects/${deposit.projectId}`,
            },
          });
        }
      } else {
        await transaction.deposit.update({
          where: {
            id: deposit.id,
          },
          data: {
            status,
            paidAt: null,
          },
        });
      }

      return {
        success: true,
        paymentId: payment.id,
      };
      }, {
        isolationLevel: "Serializable",
      }),
    );
  },

  async listByDeposit(depositId: string): Promise<DepositPaymentRecord[]> {
    const payments = await prisma.depositPayment.findMany({
      where: {
        depositId,
      },
      orderBy: {
        receivedAt: "desc",
      },
    });

    return payments.map((payment) => ({
      id: payment.id,
      depositId: payment.depositId,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      receivedAt: payment.receivedAt,
      notes: payment.notes ?? "",
    }));
  },

  async listByProject(projectId: string): Promise<DepositPaymentRecord[]> {
    const payments = await prisma.depositPayment.findMany({
      where: {
        deposit: {
          projectId,
        },
      },
      orderBy: {
        receivedAt: "desc",
      },
    });

    return payments.map((payment) => ({
      id: payment.id,
      depositId: payment.depositId,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      receivedAt: payment.receivedAt,
      notes: payment.notes ?? "",
    }));
  },

  async updateAndSynchronize(
    input,
  ): Promise<UpdateAndSynchronizeDepositPaymentResult> {
    return retrySerializableTransaction(() =>
      prisma.$transaction(async (transaction) => {
      const payment = await transaction.depositPayment.findFirst({
        where: {
          id: input.paymentId,
          deposit: {
            project: {
              workspaceId: input.workspaceId,
            },
          },
        },
        select: {
          id: true,
          depositId: true,
          deposit: {
            select: {
              amount: true,
              projectId: true,
              project: {
                select: {
                  name: true,
                  ownerId: true,
                },
              },
            },
          },
        },
      });

      if (!payment) {
        return {
          success: false,
          reason: "NOT_FOUND",
        };
      }

      await transaction.depositPayment.update({
        where: {
          id: payment.id,
        },
        data: {
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          notes: input.notes,
        },
      });

      const aggregate = await transaction.depositPayment.aggregate({
        where: {
          depositId: payment.depositId,
        },
        _sum: {
          amount: true,
        },
      });

      const totalPaid = Number(aggregate._sum.amount ?? 0);
      const depositAmount = Number(payment.deposit.amount);

      const status =
        totalPaid >= depositAmount
          ? "PAID"
          : totalPaid > 0
            ? "PARTIALLY_PAID"
            : "REQUESTED";

      if (status === "PAID") {
        const transitionResult = await transaction.deposit.updateMany({
          where: {
            id: payment.depositId,
            status: {
              not: "PAID",
            },
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        if (transitionResult.count > 0) {
          await transaction.notification.create({
            data: {
              userId: payment.deposit.project.ownerId,
              title: "Deposit paid",
              message: `Deposit for ${payment.deposit.project.name} was paid in full.`,
              type: "DEPOSIT",
              href: `/projects/${payment.deposit.projectId}`,
            },
          });
        }
      } else {
        await transaction.deposit.update({
          where: {
            id: payment.depositId,
          },
          data: {
            status,
            paidAt: null,
          },
        });
      }

      return {
        success: true,
      };
      }, {
        isolationLevel: "Serializable",
      }),
    );
  },

  async findForEdit(
    input,
  ): Promise<DepositPaymentEditRecord | null> {
    const payment = await prisma.depositPayment.findFirst({
      where: {
        id: input.paymentId,
        deposit: {
          project: {
            workspaceId: input.workspaceId,
          },
        },
      },
    });

    if (!payment) {
      return null;
    }

    return {
      id: payment.id,
      depositId: payment.depositId,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      receivedAt: payment.receivedAt,
      notes: payment.notes ?? "",
    };
  },

  async update(
    input: UpdateDepositPaymentInput & {
      workspaceId: string;
    },
  ): Promise<boolean> {
    const result = await prisma.depositPayment.updateMany({
      where: {
        id: input.paymentId,
        deposit: {
          project: {
            workspaceId: input.workspaceId,
          },
        },
      },
      data: {
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        notes: input.notes,
      },
    });

    return result.count > 0;
  },
};
