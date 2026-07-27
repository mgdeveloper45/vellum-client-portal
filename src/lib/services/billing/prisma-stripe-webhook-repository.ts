import { prisma } from "@/lib/prisma";
import type {
  PaidInvoiceReceiptDetails,
  StripeWebhookRepository,
  SubscriptionActivationInput,
} from "@/lib/services/billing/stripe-webhook-repository";

export class PrismaStripeWebhookRepository implements StripeWebhookRepository {
  async hasProcessedEvent(eventId: string): Promise<boolean> {
    const event = await prisma.stripeWebhookEvent.findUnique({
      where: {
        id: eventId,
      },
      select: {
        status: true,
      },
    });

    return event?.status === "PROCESSED";
  }

  async beginEvent(eventId: string, eventType: string): Promise<boolean> {
    const result = await prisma.stripeWebhookEvent.createMany({
      data: {
        id: eventId,
        type: eventType,
        status: "PROCESSING",
      },
      skipDuplicates: true,
    });

    return result.count === 1;
  }

  async markEventProcessed(eventId: string): Promise<void> {
    await prisma.stripeWebhookEvent.update({
      where: {
        id: eventId,
      },
      data: {
        status: "PROCESSED",
        error: null,
        processedAt: new Date(),
      },
    });
  }

  async markEventFailed(eventId: string, errorMessage: string): Promise<void> {
    await prisma.stripeWebhookEvent.update({
      where: {
        id: eventId,
      },
      data: {
        status: "FAILED",
        error: errorMessage.slice(0, 2_000),
      },
    });
  }

  async markInvoicePaid(
    invoiceId: string,
  ): Promise<PaidInvoiceReceiptDetails | null> {
    return prisma.$transaction(async (transaction) => {
      const invoice = await transaction.invoice.findUnique({
        where: {
          id: invoiceId,
        },
        select: {
          id: true,
          amount: true,
          paid: true,
          projectId: true,
          project: {
            select: {
              name: true,
              ownerId: true,
              client: {
                select: {
                  email: true,
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

      if (!invoice) {
        return null;
      }

      if (!invoice.paid) {
        await transaction.invoice.update({
          where: {
            id: invoice.id,
          },
          data: {
            paid: true,
          },
        });
      }

      return {
        invoiceId: invoice.id,
        amount: invoice.amount,
        projectId: invoice.projectId,
        projectName: invoice.project.name,
        ownerId: invoice.project.ownerId,
        clientEmail: invoice.project.client.email,
        clientName:
          `${invoice.project.client.firstName} ${invoice.project.client.lastName}`.trim(),
        businessName:
          invoice.project.workspace?.companyName ??
          invoice.project.workspace?.name ??
          "Vellum",
      };
    });
  }

  async createInvoicePaidNotification(input: {
    userId: string;
    projectId: string;
    projectName: string;
    amount: number;
  }): Promise<void> {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: "Invoice paid",
        message: `$${input.amount.toLocaleString()} invoice for ${input.projectName} was paid.`,
        type: "INVOICE",
        href: `/projects/${input.projectId}`,
      },
    });
  }

  async activateProfessionalSubscription({
    workspaceId,
    stripeCustomerId,
    stripeSubscriptionId,
    currentPeriodEnd,
  }: SubscriptionActivationInput): Promise<boolean> {
    const result = await prisma.subscription.updateMany({
      where: {
        workspaceId,
      },
      data: {
        stripeCustomerId,
        stripeSubscriptionId,
        active: true,
        plan: "PROFESSIONAL",
        currentPeriodEnd,
      },
    });

    return result.count === 1;
  }

  async deactivateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    currentPeriodEnd: Date | null,
  ): Promise<boolean> {
    const result = await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId,
      },
      data: {
        active: false,
        plan: "STARTER",
        currentPeriodEnd,
      },
    });

    return result.count === 1;
  }
}

export const prismaStripeWebhookRepository =
  new PrismaStripeWebhookRepository();
