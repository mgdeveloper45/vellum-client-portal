"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createCheckoutSessionAction() {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      workspace: {
        include: {
          subscription: true,
        },
      },
    },
  });

  if (!user?.workspace) {
    return;
  }

  let subscription = user.workspace.subscription;

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        workspaceId: user.workspace.id,
      },
    });
  }

  let stripeCustomerId = subscription.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.workspace.name,
      metadata: {
        workspaceId: user.workspace.id,
      },
    });

    stripeCustomerId = customer.id;

    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        stripeCustomerId,
      },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/settings?billing=success`,
    cancel_url: `${process.env.APP_URL}/settings?billing=cancelled`,
  });

  if (!checkoutSession.url) {
    return;
  }

  redirect(checkoutSession.url);
}
