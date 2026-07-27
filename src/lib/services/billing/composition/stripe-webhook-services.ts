import { ProcessStripeWebhookService } from "@/lib/services/billing/process-stripe-webhook-service";
import { prismaStripeWebhookRepository } from "@/lib/services/billing/prisma-stripe-webhook-repository";

export const processStripeWebhookService = new ProcessStripeWebhookService(
  prismaStripeWebhookRepository,
);
