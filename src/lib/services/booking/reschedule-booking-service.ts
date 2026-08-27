import type { BookingRule } from "@/lib/services/scheduling/booking-rules";
import type { SchedulingConfiguration } from "@/lib/services/scheduling/scheduling-configuration";
import type { SchedulingDecision } from "@/lib/services/scheduling/scheduling-decision";
import { minutesToTime, timeToMinutes } from "./availability-service";
import type { BookingRepository } from "./booking-repository";
import type { RescheduleBookingRequest } from "./reschedule-booking-request";
import {
  RescheduleBookingErrorCode,
  type RescheduleBookingResult,
} from "./reschedule-booking-result";

export interface RescheduleBookingRuleProvider {
  getWorkspaceRules(workspaceId: string): Promise<BookingRule[]>;
}

export interface RescheduleSchedulingProcessor {
  process(request: {
    workspaceId: string;
    serviceId: string;
    servicePrice: number;
    configuration: SchedulingConfiguration;
    bookingDate: Date;
    bookingStartTime: string;
    bookingEndTime: string;
    isNewClient: boolean;
    isVip: boolean;
    existingBookingsToday: number;
    bookingRules: BookingRule[];
    excludeBookingId?: string;
  }): Promise<SchedulingDecision>;
}

export interface RescheduleBookingServiceDependencies {
  bookingRepository: BookingRepository;
  bookingRuleProvider: RescheduleBookingRuleProvider;
  schedulingProcessor: RescheduleSchedulingProcessor;
  schedulingConfiguration: SchedulingConfiguration;
}

function buildBookingDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export function createRescheduleBookingService(
  dependencies: RescheduleBookingServiceDependencies,
) {
  return {
    async execute(
      request: RescheduleBookingRequest,
    ): Promise<RescheduleBookingResult> {
      const booking = await dependencies.bookingRepository.findForReschedule(
        request.bookingId,
        request.workspaceId,
      );

      if (!booking) {
        return {
          success: false,
          code: RescheduleBookingErrorCode.BOOKING_NOT_FOUND,
          reasons: ["The booking could not be found."],
        };
      }

      const endTime = minutesToTime(
        timeToMinutes(request.startTime) + booking.service.duration,
      );

      const bookingDate = buildBookingDateTime(request.date, "00:00");

      const bookingStartDateTime = buildBookingDateTime(
        request.date,
        request.startTime,
      );

      const bookingRules =
        await dependencies.bookingRuleProvider.getWorkspaceRules(
          request.workspaceId,
        );

      const schedulingDecision = await dependencies.schedulingProcessor.process(
        {
          workspaceId: request.workspaceId,
          serviceId: booking.serviceId,
          servicePrice: booking.service.price,
          configuration: dependencies.schedulingConfiguration,
          bookingDate: bookingStartDateTime,
          bookingStartTime: request.startTime,
          bookingEndTime: endTime,
          isNewClient: false,
          isVip: false,
          existingBookingsToday: 0,
          bookingRules,
          excludeBookingId: booking.id,
        },
      );

      if (!schedulingDecision.allowed) {
        return {
          success: false,
          code: RescheduleBookingErrorCode.RESCHEDULE_NOT_ALLOWED,
          reasons: schedulingDecision.reasons,
        };
      }

      try {
        const updatedBooking = await dependencies.bookingRepository.reschedule({
          bookingId: booking.id,
          date: bookingDate,
          startTime: request.startTime,
          endTime,
        });

        const slotChanged =
          booking.date.getTime() !== bookingDate.getTime() ||
          booking.startTime !== request.startTime;

        return {
          success: true,
          bookingId: updatedBooking.id,
          ...(slotChanged
            ? {
                freedSlot: {
                  serviceId: booking.serviceId,
                  date: booking.date,
                  startTime: booking.startTime,
                },
              }
            : {}),
        };
      } catch (error) {
        console.error("Booking reschedule persistence failed", {
          bookingId: booking.id,
          workspaceId: request.workspaceId,
          error,
        });

        return {
          success: false,
          code: RescheduleBookingErrorCode.BOOKING_UPDATE_FAILED,
          reasons: ["The booking could not be rescheduled. Please try again."],
        };
      }
    },
  };
}
