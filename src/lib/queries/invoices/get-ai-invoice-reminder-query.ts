import { prisma } from "@/lib/prisma";

export async function getAIInvoiceReminderQuery(
  invoiceId: string,
  workspaceId: string,
) {
  return prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      paid: false,
      project: {
        workspaceId,
      },
    },
    include: {
      project: {
        include: {
          client: true,
          workspace: true,
        },
      },
    },
  });
}