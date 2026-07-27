import type { BillingRepository } from "@/lib/services/billing/billing-repository";
import type { StripeBillingService } from "@/lib/services/billing/stripe-billing-service";

export class CreateCheckoutSessionService {
  constructor(
    private readonly billingRepository: BillingRepository,
    private readonly stripeBillingService: StripeBillingService,
  ) {}

  async execute(userId: string): Promise<string | null> {
    const billingAccount =
      await this.billingRepository.findWorkspaceBillingAccountByUserId(userId);

    if (!billingAccount) {
      return null;
    }

    let subscription = billingAccount.subscription;

    if (!subscription) {
      subscription = await this.billingRepository.createSubscription(
        billingAccount.workspaceId,
      );
    }

    let stripeCustomerId = subscription.stripeCustomerId;

    if (!stripeCustomerId) {
      stripeCustomerId = await this.stripeBillingService.createCustomer({
        email: billingAccount.userEmail,
        workspaceName: billingAccount.workspaceName,
        workspaceId: billingAccount.workspaceId,
      });

      await this.billingRepository.updateStripeCustomerId(
        subscription.id,
        stripeCustomerId,
      );
    }

    return this.stripeBillingService.createProfessionalCheckoutSession({
      stripeCustomerId,
      workspaceId: billingAccount.workspaceId,
    });
  }
}