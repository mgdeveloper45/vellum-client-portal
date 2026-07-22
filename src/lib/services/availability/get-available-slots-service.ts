import {
  generateTimeSlots,
  removeBookedSlots,
} from "../booking/availability-service";
import type { BusinessDay } from "../../constants/business-hours";
import type { BookingAvailabilityRepository } from "../../repositories/booking-availability-repository";
import type { BusinessHoursRepository } from "../business-hours/business-hours-repository";
import type { GetAvailableSlotsRequest } from "./get-available-slots-request";
import type { GetAvailableSlotsResult } from "./get-available-slots-result";

const BUSINESS_DAY_BY_INDEX: Record<number, BusinessDay> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export interface GetAvailableSlotsServiceDependencies {
  businessHoursRepository: BusinessHoursRepository;
  bookingAvailabilityRepository: BookingAvailabilityRepository;
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function createGetAvailableSlotsService({
  businessHoursRepository,
  bookingAvailabilityRepository,
}: GetAvailableSlotsServiceDependencies) {
  return async function getAvailableSlots(
    request: GetAvailableSlotsRequest,
  ): Promise<GetAvailableSlotsResult> {
    const workspaceId = request.workspaceId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    const serviceId = request.serviceId.trim();

    if (!serviceId) {
      return {
        success: false,
        reason: "INVALID_SERVICE",
        message: "A valid service is required.",
      };
    }

    if (!isValidDate(request.bookingDate)) {
      return {
        success: false,
        reason: "INVALID_DATE",
        message: "A valid booking date is required.",
      };
    }

    if (!Number.isInteger(request.duration) || request.duration <= 0) {
      return {
        success: false,
        reason: "INVALID_DURATION",
        message: "Service duration must be a positive whole number.",
      };
    }

    const dayOfWeek = BUSINESS_DAY_BY_INDEX[request.bookingDate.getDay()];

    if (!dayOfWeek) {
      return {
        success: false,
        reason: "INVALID_DATE",
        message: "The booking day could not be determined.",
      };
    }

    const businessHours = await businessHoursRepository.findForDay({
      workspaceId,
      dayOfWeek,
    });

    if (!businessHours || businessHours.closed) {
      return {
        success: true,
        availableSlots: [],
      };
    }

    const bookings =
      await bookingAvailabilityRepository.findActiveBookingsForDate({
        workspaceId,
        serviceId,
        bookingDate: request.bookingDate,
        excludeBookingId: request.excludeBookingId,
      });

    const rawSlots = generateTimeSlots({
      openTime: businessHours.openTime,
      closeTime: businessHours.closeTime,
      duration: request.duration,
    });

    const availableSlots = removeBookedSlots({
      slots: rawSlots,
      duration: request.duration,
      bookings,
    });

    return {
      success: true,
      availableSlots,
    };
  };
}

export type GetAvailableSlotsService = ReturnType<
  typeof createGetAvailableSlotsService
>;
