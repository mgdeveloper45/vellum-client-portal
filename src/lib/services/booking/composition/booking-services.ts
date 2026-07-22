import { bookingRuleRepository } from "@/lib/repositories/booking-rule-repository";
import { defaultSchedulingConfiguration } from "@/lib/services/scheduling/scheduling-configuration";
import { schedulingEngine } from "@/lib/services/scheduling/scheduling-engine";
import { createCreateBookingService } from "../create-booking-service";
import { prismaBookingRepository } from "../prisma-booking-repository";
import { prismaServiceRepository } from "../prisma-service-repository";
import { createRescheduleBookingService } from "../reschedule-booking-service";
import { createUpdateBookingStatusService } from "../update-booking-status-service";

export const createBookingService = createCreateBookingService({
  bookingRepository: prismaBookingRepository,
  serviceRepository: prismaServiceRepository,
  bookingRuleProvider: bookingRuleRepository,
  schedulingProcessor: schedulingEngine,
  schedulingConfiguration: defaultSchedulingConfiguration,
});

export const rescheduleBookingService = createRescheduleBookingService({
  bookingRepository: prismaBookingRepository,
  bookingRuleProvider: bookingRuleRepository,
  schedulingProcessor: schedulingEngine,
  schedulingConfiguration: defaultSchedulingConfiguration,
});

export const updateBookingStatusService = createUpdateBookingStatusService({
  bookingRepository: prismaBookingRepository,
});
