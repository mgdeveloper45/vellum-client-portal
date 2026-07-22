import type { BookingRepository } from "./booking-repository";
import type { UpdateBookingStatusRequest } from "./update-booking-status-request";
import {
  UpdateBookingStatusErrorCode,
  type UpdateBookingStatusResult,
} from "./update-booking-status-result";

export interface UpdateBookingStatusServiceDependencies {
  bookingRepository: BookingRepository;
}

export function createUpdateBookingStatusService(
  dependencies: UpdateBookingStatusServiceDependencies,
) {
  return {
    async execute(
      request: UpdateBookingStatusRequest,
    ): Promise<UpdateBookingStatusResult> {
      const existingBooking =
        await dependencies.bookingRepository.findForStatusUpdate(
          request.bookingId,
          request.workspaceId,
        );

      if (!existingBooking) {
        return {
          success: false,
          code: UpdateBookingStatusErrorCode.BOOKING_NOT_FOUND,
          reasons: ["The booking could not be found."],
        };
      }

      const previousGoogleCalendarEventId =
        existingBooking.googleCalendarEventId;

      const nextGoogleCalendarEventId =
        request.status === "CANCELLED" ? null : previousGoogleCalendarEventId;

      try {
        await dependencies.bookingRepository.updateStatus({
          bookingId: existingBooking.id,
          status: request.status,
          googleCalendarEventId: nextGoogleCalendarEventId,
        });

        return {
          success: true,
          bookingId: existingBooking.id,
          status: request.status,
          previousGoogleCalendarEventId,
        };
      } catch {
        return {
          success: false,
          code: UpdateBookingStatusErrorCode.BOOKING_UPDATE_FAILED,
          reasons: [
            "The booking status could not be updated. Please try again.",
          ],
        };
      }
    },
  };
}
