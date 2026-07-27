import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { logger } from "@/lib/logger";
import { createRequestId } from "@/lib/request-id";
import { runWithRequestContext } from "@/lib/request-context";
import { processStripeWebhookService } from "@/lib/services/billing/composition/stripe-webhook-services";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const requestHeaders = await headers();
  const requestId = requestHeaders.get("x-request-id") ?? createRequestId();

  return runWithRequestContext(
    {
      requestId,
    },
    async () => {
      const signature = requestHeaders.get("stripe-signature");

      if (!signature) {
        logger.warn("Stripe webhook signature missing", {
          component: "stripe-webhook",
        });

        return NextResponse.json(
          {
            received: false,
            requestId,
            error: "Missing Stripe signature.",
          },
          {
            status: 400,
            headers: {
              "Cache-Control": "no-store",
              "X-Request-Id": requestId,
            },
          },
        );
      }

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        logger.error("Stripe webhook secret is not configured", {
          component: "stripe-webhook",
        });

        return NextResponse.json(
          {
            received: false,
            requestId,
            error: "Webhook configuration error.",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
              "X-Request-Id": requestId,
            },
          },
        );
      }

      let event: Stripe.Event;

      try {
        const body = await request.text();

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (error) {
        logger.warn("Stripe webhook signature verification failed", {
          component: "stripe-webhook",
          errorName: error instanceof Error ? error.name : "UnknownError",
          errorMessage:
            error instanceof Error ? error.message : "Unknown signature error",
        });

        return NextResponse.json(
          {
            received: false,
            requestId,
            error: "Invalid Stripe signature.",
          },
          {
            status: 400,
            headers: {
              "Cache-Control": "no-store",
              "X-Request-Id": requestId,
            },
          },
        );
      }

      try {
        const result = await processStripeWebhookService.execute(event);

        logger.info("Stripe webhook acknowledged", {
          component: "stripe-webhook",
          stripeEventId: event.id,
          stripeEventType: event.type,
          processingStatus: result.status,
        });

        return NextResponse.json(
          {
            received: true,
            requestId,
            status: result.status,
          },
          {
            status: 200,
            headers: {
              "Cache-Control": "no-store",
              "X-Request-Id": requestId,
            },
          },
        );
      } catch (error) {
        logger.error("Stripe webhook processing failed", {
          component: "stripe-webhook",
          stripeEventId: event.id,
          stripeEventType: event.type,
          errorName: error instanceof Error ? error.name : "UnknownError",
          errorMessage:
            error instanceof Error
              ? error.message
              : "Unknown Stripe processing error",
        });

        return NextResponse.json(
          {
            received: false,
            requestId,
            error: "Webhook processing failed.",
          },
          {
            status: 500,
            headers: {
              "Cache-Control": "no-store",
              "X-Request-Id": requestId,
            },
          },
        );
      }
    },
  );
}
