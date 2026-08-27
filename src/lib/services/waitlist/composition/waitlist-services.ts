import { bookingRuleRepository } from "@/lib/repositories/booking-rule-repository";
import { prismaServiceRepository } from "@/lib/services/booking/prisma-service-repository";

import { DeliverWaitlistOpeningService } from "../deliver-waitlist-opening-service";
import { sendWaitlistOpening } from "../email-service";
import { JoinWaitlistService } from "../join-waitlist-service";
import { NotifyNextWaitlistEntryService } from "../notify-next-waitlist-entry-service";
import { prismaWaitlistRepository } from "../prisma-waitlist-repository";

export const joinWaitlistService = new JoinWaitlistService(
  prismaWaitlistRepository,
  prismaServiceRepository,
  bookingRuleRepository,
);

export const notifyNextWaitlistEntryService =
  new NotifyNextWaitlistEntryService(prismaWaitlistRepository);

const appUrl = process.env.APP_URL;

if (!appUrl) {
  throw new Error("APP_URL is required for waitlist notification links.");
}

export const deliverWaitlistOpeningService = new DeliverWaitlistOpeningService({
  notifyNext: notifyNextWaitlistEntryService,
  sendOpening: sendWaitlistOpening,
  releaseClaim: (input) => prismaWaitlistRepository.releaseClaim(input),
  appUrl,
});
