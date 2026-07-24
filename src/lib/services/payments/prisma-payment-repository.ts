import { prisma } from "@/lib/prisma";
import type { CheckoutInvoice, PaymentRepository } from "./payment-repository";

export class PrismaPaymentRepository implements PaymentRepository {
  async findUnpaidInvoiceForCheckout(input: {
    invoiceId: string;
    workspaceId: string;
  }): Promise<CheckoutInvoice | null> {
    return prisma.invoice.findFirst({
      where: {
        id: input.invoiceId,
        paid: false,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        amount: true,
        project: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}

export const prismaPaymentRepository = new PrismaPaymentRepository();
