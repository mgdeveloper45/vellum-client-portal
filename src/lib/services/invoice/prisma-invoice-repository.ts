import { prisma } from "@/lib/prisma";
import type {
  InvoiceListRecord,
  InvoiceMutationRecord,
  InvoicePdfRecord,
  InvoiceRepository,
} from "./invoice-repository";

export class PrismaInvoiceRepository implements InvoiceRepository {
  async projectExistsInWorkspace(input: {
    projectId: string;
    workspaceId: string;
  }): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
      },
    });

    return Boolean(project);
  }

  async createInvoice(input: {
    projectId: string;
    amount: number;
  }): Promise<InvoiceMutationRecord> {
    return prisma.invoice.create({
      data: {
        projectId: input.projectId,
        amount: input.amount,
        paid: false,
      },
      select: {
        id: true,
        projectId: true,
        amount: true,
        paid: true,
      },
    });
  }

  async findInvoiceForMutation(input: {
    invoiceId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<InvoiceMutationRecord | null> {
    return prisma.invoice.findFirst({
      where: {
        id: input.invoiceId,
        projectId: input.projectId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        projectId: true,
        amount: true,
        paid: true,
      },
    });
  }

  async updateInvoicePaid(input: {
    invoiceId: string;
    paid: boolean;
  }): Promise<InvoiceMutationRecord> {
    return prisma.invoice.update({
      where: {
        id: input.invoiceId,
      },
      data: {
        paid: input.paid,
      },
      select: {
        id: true,
        projectId: true,
        amount: true,
        paid: true,
      },
    });
  }

  async deleteInvoice(invoiceId: string): Promise<void> {
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });
  }

  async findInvoices(input: {
    workspaceId: string;
    clientId?: string;
  }): Promise<InvoiceListRecord[]> {
    return prisma.invoice.findMany({
      where: {
        project: {
          workspaceId: input.workspaceId,
          ...(input.clientId
            ? {
                clientId: input.clientId,
              }
            : {}),
        },
      },
      select: {
        id: true,
        amount: true,
        paid: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            name: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findInvoiceForPdf(input: {
    invoiceId: string;
    workspaceId: string;
  }): Promise<InvoicePdfRecord | null> {
    return prisma.invoice.findFirst({
      where: {
        id: input.invoiceId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        amount: true,
        paid: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            name: true,
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            workspace: {
              select: {
                name: true,
                companyName: true,
              },
            },
          },
        },
      },
    });
  }
}

export const prismaInvoiceRepository = new PrismaInvoiceRepository();
