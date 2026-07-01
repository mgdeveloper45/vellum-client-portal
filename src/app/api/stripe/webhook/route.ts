import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const invoiceId = session.metadata?.invoiceId;

    if (invoiceId) {
      const invoice = await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          paid: true,
        },
        include: {
          project:  true,
        },
      });

      await prisma.notification.create({
        data: {
          userId: invoice.project.ownerId,
          title: "Invoice paid",
          message: `$${invoice.amount.toLocaleString()} invoice for ${invoice.project.name} was paid.`,
          type: "INVOICE",
          href: `/projects/${invoice.projectId}`,
        },
      });

      return Response.json({ received: true });
    }

    const stripeCustomerId = String(session.customer);
    const stripeSubscriptionId = String(session.subscription);

    if (stripeCustomerId && stripeSubscriptionId) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ["subscription"],
        },
      );

      const subscription = checkoutSession.subscription as Stripe.Subscription;

      const currentPeriodEnd = subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000)
        : null;

      await prisma.subscription.update({
        where: {
          stripeCustomerId,
        },
        data: {
          stripeSubscriptionId,
          active: true,
          plan: "PROFESSIONAL",
          currentPeriodEnd,
        },
      });
    }
  }

  return Response.json({ received: true });
}
