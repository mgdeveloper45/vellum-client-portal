import { prismaBookingAvailabilityRepository } from "../../../repositories/prisma-booking-availability-repository";
import { prismaBusinessHoursRepository } from "../../business-hours/prisma-business-hours-repository";
import { createGetAvailableSlotsService } from "../get-available-slots-service";

export const getAvailableSlotsService = createGetAvailableSlotsService({
  businessHoursRepository: prismaBusinessHoursRepository,
  bookingAvailabilityRepository: prismaBookingAvailabilityRepository,
});
