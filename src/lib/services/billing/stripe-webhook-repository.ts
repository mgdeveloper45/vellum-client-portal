export type StripeWebhookEventStatus =
  | "PROCESSING"
  | "PROCESSED"
  | "FAILED";

export type PaidInvoiceReceiptDetails = {
  invoiceId: string;
  amount: number;
  projectId: string;
  projectName: string;
  ownerId: string;
  clientEmail: string;
  clientName: string;
  businessName: string;
};

export type SubscriptionActivationInput = {
  workspaceId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodEnd: Date | null;
};

export interface StripeWebhookRepository {
  hasProcessedEvent(eventId: string): Promise<boolean>;

  beginEvent(eventId: string, eventType: string): Promise<boolean>;

  markEventProcessed(eventId: string): Promise<void>;

  markEventFailed(eventId: string, errorMessage: string): Promise<void>;

  markInvoicePaid(
    invoiceId: string,
  ): Promise<PaidInvoiceReceiptDetails | null>;

  createInvoicePaidNotification(input: {
    userId: string;
    projectId: string;
    projectName: string;
    amount: number;
  }): Promise<void>;

  activateProfessionalSubscription(
    input: SubscriptionActivationInput,
  ): Promise<boolean>;

  deactivateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    currentPeriodEnd: Date | null,
  ): Promise<boolean>;
}