import type { BookingRule } from "@/lib/services/scheduling/booking-rules";
import type { SchedulingDecision } from "@/lib/services/scheduling/scheduling-decision";
import type { SchedulingConfiguration } from "@/lib/services/scheduling/scheduling-configuration";
import { minutesToTime, timeToMinutes } from "./availability-service";
import type { BookingRepository } from "./booking-repository";
import type { BookingRequest } from "./booking-request";
import {
  BookingErrorCode,
  type BookingResult,
} from "./booking-result";

interface BookingRuleProvider {
  getWorkspaceRules(workspaceId: string): Promise<BookingRule[]>;
}

interface SchedulingProcessor {
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
  }): Promise<SchedulingDecision>;
}

interface CreateBookingServiceDependencies {
  bookingRepository: BookingRepository;
  bookingRuleProvider: BookingRuleProvider;
  schedulingProcessor: SchedulingProcessor;
  schedulingConfiguration: SchedulingConfiguration;
}

function buildBookingDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export function createCreateBookingService(
  dependencies: CreateBookingServiceDependencies,
) {
  return {
    async execute(request: BookingRequest): Promise<BookingResult> {
      const service = await dependencies.bookingRepository.findActiveService(
        request.serviceId,
        request.workspaceId,
      );

      if (!service) {
        return {
          success: false,
          code: BookingErrorCode.SERVICE_NOT_FOUND,
          reasons: ["The selected service is unavailable."],
        };
      }

      const bookingDate = buildBookingDateTime(request.date, "00:00");
      const bookingStartDateTime = buildBookingDateTime(
        request.date,
        request.startTime,
      );

      const endTime = minutesToTime(
        timeToMinutes(request.startTime) + service.duration,
      );

      const bookingRules =
        await dependencies.bookingRuleProvider.getWorkspaceRules(
          request.workspaceId,
        );

      const schedulingDecision =
        await dependencies.schedulingProcessor.process({
          workspaceId: request.workspaceId,
          serviceId: request.serviceId,
          servicePrice: service.price,
          configuration: dependencies.schedulingConfiguration,
          bookingDate: bookingStartDateTime,
          bookingStartTime: request.startTime,
          bookingEndTime: endTime,
          isNewClient: true,
          isVip: false,
          existingBookingsToday: 0,
          bookingRules,
        });

      if (!schedulingDecision.allowed) {
        return {
          success: false,
          code: BookingErrorCode.BOOKING_NOT_ALLOWED,
          reasons: schedulingDecision.reasons,
        };
      }

      if (!schedulingDecision.deposit) {
        return {
          success: false,
          code: BookingErrorCode.DEPOSIT_CALCULATION_FAILED,
          reasons: ["The booking deposit could not be calculated."],
        };
      }

      try {
        const booking = await dependencies.bookingRepository.create({
          customerName: request.customerName,
          customerEmail: request.customerEmail,
          customerPhone: request.customerPhone ?? null,
          notes: request.notes ?? null,
          date: bookingDate,
          startTime: request.startTime,
          endTime,
          serviceId: request.serviceId,
          workspaceId: request.workspaceId,
        });

        return {
          success: true,
          bookingId: booking.id,
        };
      } catch (error) {
        console.error("Booking persistence failed", {
          workspaceId: request.workspaceId,
          serviceId: request.serviceId,
          error,
        });

        return {
          success: false,
          code: BookingErrorCode.BOOKING_CREATE_FAILED,
          reasons: ["The booking could not be created. Please try again."],
        };
      }
    },
  };
}