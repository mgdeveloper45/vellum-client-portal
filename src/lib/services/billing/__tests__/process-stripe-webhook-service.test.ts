import type Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProcessStripeWebhookService } from "@/lib/services/billing/process-stripe-webhook-service";
import type {
  PaidInvoiceReceiptDetails,
  StripeWebhookRepository,
  SubscriptionActivationInput,
} from "@/lib/services/billing/stripe-webhook-repository";
import { sendInvoiceReceipt } from "@/lib/services/invoice/email-service";

function flushSetImmediate() {
  return new Promise<void>((resolve) => {
    setImmediate(resolve);
  });
}

vi.mock("@/lib/services/invoice/email-service", () => ({
  sendInvoiceReceipt: vi.fn(),
}));

type StoredEvent = {
  type: string;
  status: "PROCESSING" | "PROCESSED" | "FAILED";
  error: string | null;
};

type NotificationInput = {
  userId: string;
  projectId: string;
  projectName: string;
  amount: number;
};

class InMemoryStripeWebhookRepository implements StripeWebhookRepository {
  readonly events = new Map<string, StoredEvent>();

  readonly invoices = new Map<string, PaidInvoiceReceiptDetails>();

  readonly paidInvoiceIds: string[] = [];

  readonly notifications: NotificationInput[] = [];

  readonly activations: SubscriptionActivationInput[] = [];

  readonly deactivations: Array<{
    stripeSubscriptionId: string;
    currentPeriodEnd: Date | null;
  }> = [];

  activationResult = true;

  deactivationResult = true;

  invoiceFailure: Error | null = null;

  async beginEvent(eventId: string, eventType: string): Promise<boolean> {
    const existing = this.events.get(eventId);

    if (!existing) {
      this.events.set(eventId, {
        type: eventType,
        status: "PROCESSING",
        error: null,
      });

      return true;
    }

    if (existing.status !== "FAILED") {
      return false;
    }

    this.events.set(eventId, {
      type: eventType,
      status: "PROCESSING",
      error: null,
    });

    return true;
  }

  async markEventProcessed(eventId: string): Promise<void> {
    const event = this.requireEvent(eventId);

    this.events.set(eventId, {
      ...event,
      status: "PROCESSED",
      error: null,
    });
  }

  async markEventFailed(eventId: string, errorMessage: string): Promise<void> {
    const event = this.requireEvent(eventId);

    this.events.set(eventId, {
      ...event,
      status: "FAILED",
      error: errorMessage,
    });
  }

  async markInvoicePaid(
    invoiceId: string,
  ): Promise<PaidInvoiceReceiptDetails | null> {
    if (this.invoiceFailure) {
      throw this.invoiceFailure;
    }

    const invoice = this.invoices.get(invoiceId) ?? null;

    if (invoice) {
      this.paidInvoiceIds.push(invoiceId);
    }

    return invoice;
  }

  async createInvoicePaidNotification(input: NotificationInput): Promise<void> {
    this.notifications.push(input);
  }

  async activateProfessionalSubscription(
    input: SubscriptionActivationInput,
  ): Promise<boolean> {
    this.activations.push(input);

    return this.activationResult;
  }

  async deactivateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    currentPeriodEnd: Date | null,
  ): Promise<boolean> {
    this.deactivations.push({
      stripeSubscriptionId,
      currentPeriodEnd,
    });

    return this.deactivationResult;
  }

  private requireEvent(eventId: string): StoredEvent {
    const event = this.events.get(eventId);

    if (!event) {
      throw new Error(`Webhook event ${eventId} was not started.`);
    }

    return event;
  }
}

function createStripeEvent<TObject>(input: {
  id: string;
  type: string;
  object: TObject;
}): Stripe.Event {
  return {
    id: input.id,
    object: "event",
    api_version: "2026-01-28.clover",
    created: 1_700_000_000,
    data: {
      object: input.object,
    },
    livemode: false,
    pending_webhooks: 1,
    request: null,
    type: input.type,
  } as unknown as Stripe.Event;
}

function createCheckoutSession(
  overrides: Partial<Stripe.Checkout.Session> = {},
): Stripe.Checkout.Session {
  return {
    id: "cs_test_123",
    object: "checkout.session",
    mode: "subscription",
    customer: "cus_123",
    subscription: "sub_123",
    metadata: {
      workspaceId: "workspace_123",
      checkoutType: "subscription",
      plan: "PROFESSIONAL",
    },
    ...overrides,
  } as Stripe.Checkout.Session;
}

function createSubscription(
  overrides: Partial<Stripe.Subscription> = {},
): Stripe.Subscription {
  return {
    id: "sub_123",
    object: "subscription",
    customer: "cus_123",
    metadata: {
      workspaceId: "workspace_123",
      plan: "PROFESSIONAL",
    },
    status: "active",
    items: {
      object: "list",
      data: [
        {
          current_period_end: 1_800_000_000,
        },
      ],
      has_more: false,
      url: "/v1/subscription_items",
    },
    ...overrides,
  } as unknown as Stripe.Subscription;
}

describe("ProcessStripeWebhookService", () => {
  let repository: InMemoryStripeWebhookRepository;
  let service: ProcessStripeWebhookService;

  beforeEach(() => {
    vi.clearAllMocks();

    repository = new InMemoryStripeWebhookRepository();
    service = new ProcessStripeWebhookService(repository);
  });

  it("activates a professional subscription after checkout", async () => {
    const event = createStripeEvent({
      id: "evt_subscription_checkout",
      type: "checkout.session.completed",
      object: createCheckoutSession(),
    });

    const result = await service.execute(event);

    expect(result).toEqual({
      status: "processed",
    });

    expect(repository.activations).toEqual([
      {
        workspaceId: "workspace_123",
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_123",
        currentPeriodEnd: null,
      },
    ]);

    expect(repository.events.get(event.id)).toEqual({
      type: "checkout.session.completed",
      status: "PROCESSED",
      error: null,
    });
  });

  it("synchronizes an active subscription and period end", async () => {
    const periodEndTimestamp = 1_800_000_000;

    const event = createStripeEvent({
      id: "evt_subscription_updated",
      type: "customer.subscription.updated",
      object: createSubscription({
        status: "active",
        items: {
          object: "list",
          data: [
            {
              current_period_end: periodEndTimestamp,
            },
          ],
          has_more: false,
          url: "/v1/subscription_items",
        } as Stripe.ApiList<Stripe.SubscriptionItem>,
      }),
    });

    const result = await service.execute(event);

    expect(result.status).toBe("processed");

    expect(repository.activations).toEqual([
      {
        workspaceId: "workspace_123",
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_123",
        currentPeriodEnd: new Date(periodEndTimestamp * 1_000),
      },
    ]);
  });

  it("deactivates a subscription when Stripe deletes it", async () => {
    const periodEndTimestamp = 1_800_000_000;

    const event = createStripeEvent({
      id: "evt_subscription_deleted",
      type: "customer.subscription.deleted",
      object: createSubscription({
        status: "canceled",
        items: {
          object: "list",
          data: [
            {
              current_period_end: periodEndTimestamp,
            },
          ],
          has_more: false,
          url: "/v1/subscription_items",
        } as Stripe.ApiList<Stripe.SubscriptionItem>,
      }),
    });

    await service.execute(event);

    expect(repository.deactivations).toEqual([
      {
        stripeSubscriptionId: "sub_123",
        currentPeriodEnd: new Date(periodEndTimestamp * 1_000),
      },
    ]);
  });

  it("marks an invoice paid, creates a notification, and sends a receipt", async () => {
    repository.invoices.set("invoice_123", {
      invoiceId: "invoice_123",
      amount: 2_500,
      projectId: "project_123",
      projectName: "Website Redesign",
      ownerId: "owner_123",
      clientEmail: "client@example.com",
      clientName: "Jordan Lee",
      businessName: "Northstar Studio",
    });

    const event = createStripeEvent({
      id: "evt_invoice_payment",
      type: "checkout.session.completed",
      object: createCheckoutSession({
        mode: "payment",
        customer: null,
        subscription: null,
        metadata: {
          invoiceId: "invoice_123",
        },
      }),
    });

    const result = await service.execute(event);

    expect(result.status).toBe("processed");

    expect(repository.paidInvoiceIds).toEqual(["invoice_123"]);

    expect(repository.notifications).toEqual([
      {
        userId: "owner_123",
        projectId: "project_123",
        projectName: "Website Redesign",
        amount: 2_500,
      },
    ]);
    await flushSetImmediate();

    expect(sendInvoiceReceipt).toHaveBeenCalledOnce();

    expect(sendInvoiceReceipt).toHaveBeenCalledWith({
      email: "client@example.com",
      clientName: "Jordan Lee",
      businessName: "Northstar Studio",
      projectName: "Website Redesign",
      amount: 2_500,
      invoiceId: "invoice_123",
    });
  });

  it("does not repeat side effects for a duplicate delivery", async () => {
    repository.invoices.set("invoice_123", {
      invoiceId: "invoice_123",
      amount: 2_500,
      projectId: "project_123",
      projectName: "Website Redesign",
      ownerId: "owner_123",
      clientEmail: "client@example.com",
      clientName: "Jordan Lee",
      businessName: "Northstar Studio",
    });

    const event = createStripeEvent({
      id: "evt_duplicate",
      type: "checkout.session.completed",
      object: createCheckoutSession({
        mode: "payment",
        customer: null,
        subscription: null,
        metadata: {
          invoiceId: "invoice_123",
        },
      }),
    });

    const firstResult = await service.execute(event);
    const secondResult = await service.execute(event);

    expect(firstResult.status).toBe("processed");
    expect(secondResult.status).toBe("duplicate");

    expect(repository.paidInvoiceIds).toHaveLength(1);
    expect(repository.notifications).toHaveLength(1);
    
    await flushSetImmediate();
    
    expect(sendInvoiceReceipt).toHaveBeenCalledTimes(1);
  });

  it("marks a failed event and allows Stripe to retry it", async () => {
    repository.invoiceFailure = new Error("Temporary database failure");

    const event = createStripeEvent({
      id: "evt_retryable",
      type: "checkout.session.completed",
      object: createCheckoutSession({
        mode: "payment",
        customer: null,
        subscription: null,
        metadata: {
          invoiceId: "invoice_123",
        },
      }),
    });

    await expect(service.execute(event)).rejects.toThrow(
      "Temporary database failure",
    );

    expect(repository.events.get(event.id)).toEqual({
      type: "checkout.session.completed",
      status: "FAILED",
      error: "Temporary database failure",
    });

    repository.invoiceFailure = null;

    repository.invoices.set("invoice_123", {
      invoiceId: "invoice_123",
      amount: 1_200,
      projectId: "project_123",
      projectName: "Brand Strategy",
      ownerId: "owner_123",
      clientEmail: "client@example.com",
      clientName: "Jordan Lee",
      businessName: "Northstar Studio",
    });

    const retryResult = await service.execute(event);

    expect(retryResult.status).toBe("processed");

    expect(repository.events.get(event.id)).toEqual({
      type: "checkout.session.completed",
      status: "PROCESSED",
      error: null,
    });

    expect(repository.paidInvoiceIds).toEqual(["invoice_123"]);
  });

  it("completes payment processing when receipt email delivery fails", async () => {
    vi.mocked(sendInvoiceReceipt).mockRejectedValueOnce(
      new Error("Email provider unavailable"),
    );

    repository.invoices.set("invoice_123", {
      invoiceId: "invoice_123",
      amount: 750,
      projectId: "project_123",
      projectName: "Consulting Session",
      ownerId: "owner_123",
      clientEmail: "client@example.com",
      clientName: "Jordan Lee",
      businessName: "Northstar Studio",
    });

    const event = createStripeEvent({
      id: "evt_email_failure",
      type: "checkout.session.completed",
      object: createCheckoutSession({
        mode: "payment",
        customer: null,
        subscription: null,
        metadata: {
          invoiceId: "invoice_123",
        },
      }),
    });

    const result = await service.execute(event);

    expect(result.status).toBe("processed");
    expect(repository.paidInvoiceIds).toEqual(["invoice_123"]);
    expect(repository.notifications).toHaveLength(1);

    expect(repository.events.get(event.id)?.status).toBe("PROCESSED");
  });

  it("marks an event failed when subscription metadata is incomplete", async () => {
    const event = createStripeEvent({
      id: "evt_invalid_subscription",
      type: "checkout.session.completed",
      object: createCheckoutSession({
        metadata: {},
        customer: null,
        subscription: null,
      }),
    });

    await expect(service.execute(event)).rejects.toThrow(
      "Subscription checkout is missing workspace, customer, or subscription metadata.",
    );

    expect(repository.events.get(event.id)).toEqual({
      type: "checkout.session.completed",
      status: "FAILED",
      error:
        "Subscription checkout is missing workspace, customer, or subscription metadata.",
    });

    expect(repository.activations).toHaveLength(0);
  });

  it("records unsupported Stripe event types without business side effects", async () => {
    const event = createStripeEvent({
      id: "evt_ignored",
      type: "payment_intent.created",
      object: {
        id: "pi_123",
        object: "payment_intent",
      },
    });

    const result = await service.execute(event);

    expect(result.status).toBe("ignored");

    expect(repository.events.get(event.id)?.status).toBe("PROCESSED");

    expect(repository.activations).toHaveLength(0);
    expect(repository.deactivations).toHaveLength(0);
    expect(repository.notifications).toHaveLength(0);
    expect(sendInvoiceReceipt).not.toHaveBeenCalled();
  });
});
