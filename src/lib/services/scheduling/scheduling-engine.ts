import { AdvanceNoticePolicy } from "./policies/advance-notice-policy";
import { PolicyPipeline } from "./policies/policy-pipeline";
import { processScheduling } from "./scheduling-orchestrator";
import { BookingWindowPolicy } from "./policies/booking-window-policy";
import { BusinessHoursPolicy } from "./policies/business-hours-policy";
import { StaffWorkingHoursPolicy } from "./policies/staff-working-hours-policy";
import { DefaultSchedulingResourceProvider } from "./resources/default-resource-provider";
import { PrismaBookingAvailabilityRepository } from "@/lib/repositories/prisma-booking-availability-repository";
import { createAvailabilityChecker } from "./availability-engine";

const bookingAvailabilityRepository =
  new PrismaBookingAvailabilityRepository();

const checkAvailability =
  createAvailabilityChecker(
    bookingAvailabilityRepository,
  );

const resourceProvider =
  new DefaultSchedulingResourceProvider();

const policyPipeline = new PolicyPipeline([
  new AdvanceNoticePolicy(),
  new BookingWindowPolicy(),
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
