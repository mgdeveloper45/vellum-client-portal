import { prisma } from "@/lib/prisma";
import type {
  BillingRepository,
  BillingSubscription,
  WorkspaceBillingAccount,
} from "@/lib/services/billing/billing-repository";

export class PrismaBillingRepository implements BillingRepository {
  async findWorkspaceBillingAccountByUserId(
    userId: string,
  ): Promise<WorkspaceBillingAccount | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        workspace: {
          select: {
            id: true,
            name: true,
            subscription: {
              select: {
                id: true,
                stripeCustomerId: true,
              },
            },
          },
        },
      },
    });

    if (!user?.workspace) {
      return null;
    }

    return {
      workspaceId: user.workspace.id,
      workspaceName: user.workspace.name,
      userEmail: user.email,
      subscription: user.workspace.subscription,
    };
  }

  async createSubscription(workspaceId: string): Promise<BillingSubscription> {
    return prisma.subscription.create({
      data: {
        workspaceId,
      },
      select: {
        id: true,
        stripeCustomerId: true,
      },
    });
  }

  async updateStripeCustomerId(
    subscriptionId: string,
    stripeCustomerId: string,
  ): Promise<void> {
    await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        stripeCustomerId,
      },
    });
  }

  async findStripeCustomerIdByUserId(userId: string): Promise<string | null> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        workspace: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      select: {
        stripeCustomerId: true,
      },
    });

    return subscription?.stripeCustomerId ?? null;
  }
}

export const prismaBillingRepository = new PrismaBillingRepository();
