import { prisma } from "@/lib/prisma";

import type {
  DepositPaymentRecord,
  DepositPaymentRepository,
  RecordDepositPaymentInput,
} from "./deposit-payment-repository";

export const prismaDepositPaymentRepository: DepositPaymentRepository = {
  async create(input: RecordDepositPaymentInput): Promise<{ id: string }> {
    return prisma.depositPayment.create({
      data: {
        depositId: input.depositId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        notes: input.notes,
      },
      select: {
        id: true,
      },
    });
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
};
