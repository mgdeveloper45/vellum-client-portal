import type { BillingRepository } from "@/lib/services/billing/billing-repository";
import type { StripeBillingService } from "@/lib/services/billing/stripe-billing-service";

export class OpenCustomerPortalService {
  constructor(
    private readonly billingRepository: BillingRepository,
    private readonly stripeBillingService: StripeBillingService,
  ) {}

  async execute(userId: string): Promise<string | null> {
    const stripeCustomerId =
      await this.billingRepository.findStripeCustomerIdByUserId(userId);

    if (!stripeCustomerId) {
      return null;
    }

    return this.stripeBillingService.createCustomerPortalSession({
      stripeCustomerId,
    });
  }
}
