import { PrismaBlackoutDateRepository } from "@/lib/repositories/prisma-blackout-date-repository";
import { PrismaBookingAvailabilityRepository } from "@/lib/repositories/prisma-booking-availability-repository";

import { createAvailabilityChecker } from "./availability-engine";
import { AdvanceNoticePolicy } from "./policies/advance-notice-policy";
import { BlackoutDatePolicy } from "./policies/blackout-date-policy";
import { BookingWindowPolicy } from "./policies/booking-window-policy";
import { BusinessHoursPolicy } from "./policies/business-hours-policy";
import { PolicyPipeline } from "./policies/policy-pipeline";
import { StaffWorkingHoursPolicy } from "./policies/staff-working-hours-policy";
import { DefaultSchedulingResourceProvider } from "./resources/default-resource-provider";
import { processScheduling } from "./scheduling-orchestrator";

const bookingAvailabilityRepository =
  new PrismaBookingAvailabilityRepository();

const blackoutDateRepository =
  new PrismaBlackoutDateRepository();

const checkAvailability = createAvailabilityChecker(
  bookingAvailabilityRepository,
);

const resourceProvider =
  new DefaultSchedulingResourceProvider();

const policyPipeline = new PolicyPipeline([
  new AdvanceNoticePolicy(),
  new BookingWindowPolicy(),
  new BlackoutDatePolicy(blackoutDateRepository),
  new BusinessHoursPolicy(),
  new StaffWorkingHoursPolicy(resourceProvider),
]);

export const schedulingEngine = {
  process(request: Parameters<typeof processScheduling>[0]) {
    return processScheduling(request, {
      policyPipeline,
      checkAvailability,
    });
  },
};