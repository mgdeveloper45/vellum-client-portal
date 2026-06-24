"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function openCustomerPortalAction() {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      workspace: {
        users: {
          some: {
            id: session.user.id,
          },
        },
      },
    },
  });

  if (!subscription?.stripeCustomerId) {
    return;
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.APP_URL}/settings`,
  });

  redirect(portal.url);
}
