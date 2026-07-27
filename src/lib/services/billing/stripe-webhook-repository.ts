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
  /**
   * Claims an event for processing.
   *
   * Returns true when:
   * - the event is new, or
   * - a previously failed event is reclaimed.
   *
   * Returns false when another request is already processing it
   * or it has already completed successfully.
   */
  beginEvent(eventId: string, eventType: string): Promise<boolean>;

  markEventProcessed(eventId: string): Promise<void>;

  markEventFailed(eventId: string, errorMessage: string): Promise<void>;

  markInvoicePaid(invoiceId: string): Promise<PaidInvoiceReceiptDetails | null>;

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
