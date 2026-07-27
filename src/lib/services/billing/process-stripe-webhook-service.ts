import type Stripe from "stripe";

import { logger } from "@/lib/logger";
import { sendInvoiceReceipt } from "@/lib/services/invoice/email-service";
import type { StripeWebhookRepository } from "@/lib/services/billing/stripe-webhook-repository";

type ProcessStripeWebhookResult =
  | {
      status: "processed";
    }
  | {
      status: "duplicate";
    }
  | {
      status: "ignored";
    };

export class ProcessStripeWebhookService {
  constructor(private readonly repository: StripeWebhookRepository) {}

  async execute(event: Stripe.Event): Promise<ProcessStripeWebhookResult> {
    const started = await this.repository.beginEvent(event.id, event.type);

    if (!started) {
      logger.info("Duplicate Stripe webhook ignored", {
        component: "stripe-webhook",
        stripeEventId: event.id,
        stripeEventType: event.type,
      });

      return {
        status: "duplicate",
      };
    }

    try {
      const result = await this.processEvent(event);

      await this.repository.markEventProcessed(event.id);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown Stripe webhook error";

      await this.repository.markEventFailed(event.id, errorMessage);

      throw error;
    }
  }

  private async processEvent(
    event: Stripe.Event,
  ): Promise<ProcessStripeWebhookResult> {
    switch (event.type) {
      case "checkout.session.completed":
        await this.processCheckoutSessionCompleted(event.data.object);

        return {
          status: "processed",
        };

      case "customer.subscription.updated":
        await this.processSubscriptionUpdated(event.data.object);

        return {
          status: "processed",
        };

      case "customer.subscription.deleted":
        await this.processSubscriptionDeleted(event.data.object);

        return {
          status: "processed",
        };

      default:
        logger.debug("Stripe webhook event ignored", {
          component: "stripe-webhook",
          stripeEventId: event.id,
          stripeEventType: event.type,
        });

        return {
          status: "ignored",
        };
    }
  }

  private async processCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const invoiceId = session.metadata?.invoiceId;

    if (invoiceId) {
      await this.processInvoicePayment(invoiceId);

      return;
    }

    if (session.mode !== "subscription") {
      return;
    }

    const workspaceId = session.metadata?.workspaceId;
    const stripeCustomerId = this.getStripeId(session.customer);
    const stripeSubscriptionId = this.getStripeId(session.subscription);

    if (!workspaceId || !stripeCustomerId || !stripeSubscriptionId) {
      throw new Error(
        "Subscription checkout is missing workspace, customer, or subscription metadata.",
      );
    }

    /*
     * We do not depend on the Checkout Session expansion here.
     * The later customer.subscription.updated event is responsible
     * for synchronizing the complete subscription state.
     */
    const updated = await this.repository.activateProfessionalSubscription({
      workspaceId,
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd: null,
    });

    if (!updated) {
      throw new Error(
        `No Vellum subscription exists for workspace ${workspaceId}.`,
      );
    }

    logger.info("Professional subscription activated", {
      component: "stripe-webhook",
      workspaceId,
      stripeCustomerId,
      stripeSubscriptionId,
    });
  }

  private async processInvoicePayment(invoiceId: string): Promise<void> {
    const invoice = await this.repository.markInvoicePaid(invoiceId);

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} was not found.`);
    }

    await this.repository.createInvoicePaidNotification({
      userId: invoice.ownerId,
      projectId: invoice.projectId,
      projectName: invoice.projectName,
      amount: invoice.amount,
    });

    try {
      await sendInvoiceReceipt({
        email: invoice.clientEmail,
        clientName: invoice.clientName,
        businessName: invoice.businessName,
        projectName: invoice.projectName,
        amount: invoice.amount,
        invoiceId: invoice.invoiceId,
      });
    } catch (error) {
      logger.error("Invoice receipt email failed", {
        component: "stripe-webhook",
        invoiceId: invoice.invoiceId,
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage:
          error instanceof Error ? error.message : "Unknown email error",
      });
    }

    logger.info("Invoice payment processed", {
      component: "stripe-webhook",
      invoiceId: invoice.invoiceId,
      projectId: invoice.projectId,
      amount: invoice.amount,
    });
  }

  private async processSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const workspaceId = subscription.metadata.workspaceId;
    const stripeCustomerId = this.getStripeId(subscription.customer);

    if (!workspaceId || !stripeCustomerId) {
      throw new Error(
        `Stripe subscription ${subscription.id} is missing Vellum workspace metadata.`,
      );
    }

    const active =
      subscription.status === "active" || subscription.status === "trialing";

    const currentPeriodEnd = subscription.items.data[0]?.current_period_end
      ? new Date(subscription.items.data[0].current_period_end * 1_000)
      : null;

    if (active) {
      const updated = await this.repository.activateProfessionalSubscription({
        workspaceId,
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        currentPeriodEnd,
      });

      if (!updated) {
        throw new Error(
          `No Vellum subscription exists for workspace ${workspaceId}.`,
        );
      }

      return;
    }

    await this.repository.deactivateSubscriptionByStripeId(
      subscription.id,
      currentPeriodEnd,
    );
  }

  private async processSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const currentPeriodEnd = subscription.items.data[0]?.current_period_end
      ? new Date(subscription.items.data[0].current_period_end * 1_000)
      : null;

    const updated = await this.repository.deactivateSubscriptionByStripeId(
      subscription.id,
      currentPeriodEnd,
    );

    if (!updated) {
      logger.warn("Deleted Stripe subscription was not found in Vellum", {
        component: "stripe-webhook",
        stripeSubscriptionId: subscription.id,
      });
    }
  }

  private getStripeId(
    value:
      | string
      | Stripe.Customer
      | Stripe.Subscription
      | Stripe.DeletedCustomer
      | null,
  ): string | null {
    if (!value) {
      return null;
    }

    return typeof value === "string" ? value : value.id;
  }
}
