import { bookingRuleRepository } from "@/lib/repositories/booking-rule-repository";
import { defaultSchedulingConfiguration } from "@/lib/services/scheduling/scheduling-configuration";
import { schedulingEngine } from "@/lib/services/scheduling/scheduling-engine";
import { createCreateBookingService } from "./create-booking-service";
import { prismaBookingRepository } from "./prisma-booking-repository";

export const createBookingService = createCreateBookingService({
  bookingRepository: prismaBookingRepository,
  bookingRuleProvider: bookingRuleRepository,
  schedulingProcessor: schedulingEngine,
  schedulingConfiguration: defaultSchedulingConfiguration,
});
