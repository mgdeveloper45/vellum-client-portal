import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { createRequestId } from "@/lib/request-id";
import { runWithRequestContext } from "@/lib/request-context";
import { processStripeWebhookService } from "@/lib/services/billing/composition/stripe-webhook-services";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const requestStart = performance.now();

  console.log("🔥 Stripe webhook received");

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

        console.log(`✅ Stripe Event: ${event.type}`);
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
        const processingStart = performance.now();

        const result = await processStripeWebhookService.execute(event);

        const processingMs = Math.round(performance.now() - processingStart);

        logger.info("Stripe webhook processed", {
          component: "stripe-webhook",
          stripeEventId: event.id,
          stripeEventType: event.type,
          processingStatus: result.status,
          processingMs,
        });

        console.log(
          `✅ Webhook processed in ${processingMs}ms (${event.type})`,
        );

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

        console.error(error);

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
      } finally {
        const totalMs = Math.round(performance.now() - requestStart);

        console.log(`🏁 Webhook finished in ${totalMs}ms`);

        // Optional: log active DB connections while debugging.
        try {
          await prisma.$queryRaw`SELECT 1`;
        } catch {
          // Ignore.
        }
      }
    },
  );
}
