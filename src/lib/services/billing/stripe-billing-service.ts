import { stripe } from "@/lib/stripe";

type CreateStripeCustomerParams = {
  email: string | null;
  workspaceName: string;
  workspaceId: string;
};

type CreateProfessionalCheckoutSessionParams = {
  stripeCustomerId: string;
  workspaceId: string;
};

type CreateCustomerPortalSessionParams = {
  stripeCustomerId: string;
};

export class StripeBillingService {
  async createCustomer({
    email,
    workspaceName,
    workspaceId,
  }: CreateStripeCustomerParams): Promise<string> {
    const customer = await stripe.customers.create({
      email: email ?? undefined,
      name: workspaceName,
      metadata: {
        workspaceId,
      },
    });

    return customer.id;
  }

  async createProfessionalCheckoutSession({
    stripeCustomerId,
    workspaceId,
  }: CreateProfessionalCheckoutSessionParams): Promise<string | null> {
    const priceId = process.env.STRIPE_PROFESSIONAL_PRICE_ID;
    const appUrl = process.env.APP_URL;

    if (!priceId) {
      throw new Error("STRIPE_PROFESSIONAL_PRICE_ID is not configured.");
    }

    if (!appUrl) {
      throw new Error("APP_URL is not configured.");
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        workspaceId,
        checkoutType: "subscription",
        plan: "PROFESSIONAL",
      },
      subscription_data: {
        metadata: {
          workspaceId,
          plan: "PROFESSIONAL",
        },
      },
      success_url: `${appUrl}/settings?billing=success`,
      cancel_url: `${appUrl}/settings?billing=cancelled`,
    });

    return checkoutSession.url;
  }

  async createCustomerPortalSession({
    stripeCustomerId,
  }: CreateCustomerPortalSessionParams): Promise<string> {
    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      throw new Error("APP_URL is not configured.");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${appUrl}/settings`,
    });

    return portalSession.url;
  }
}

export const stripeBillingService = new StripeBillingService();
