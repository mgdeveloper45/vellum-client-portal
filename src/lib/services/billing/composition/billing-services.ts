import { CreateCheckoutSessionService } from "@/lib/services/billing/create-checkout-session-service";
import { OpenCustomerPortalService } from "@/lib/services/billing/open-customer-portal-service";
import { prismaBillingRepository } from "@/lib/services/billing/prisma-billing-repository";
import { stripeBillingService } from "@/lib/services/billing/stripe-billing-service";

export const createCheckoutSessionService = new CreateCheckoutSessionService(
  prismaBillingRepository,
  stripeBillingService,
);

export const openCustomerPortalService = new OpenCustomerPortalService(
  prismaBillingRepository,
  stripeBillingService,
);
