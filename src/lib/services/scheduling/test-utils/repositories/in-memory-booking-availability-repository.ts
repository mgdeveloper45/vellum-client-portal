import type {
  BookingAvailabilityRecord,
  BookingAvailabilityRepository,
  FindBookingAvailabilityInput,
} from "@/lib/repositories/booking-availability-repository";

export type InMemoryBookingStatus =
  "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface InMemoryBookingAvailabilityRecord extends BookingAvailabilityRecord {
  workspaceId: string;
  bookingDate: Date;
  status: InMemoryBookingStatus;
}

function normalizeDateValue(date: Date): number {
  const normalizedDate = new Date(date);

  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate.getTime();
}

export class InMemoryBookingAvailabilityRepository implements BookingAvailabilityRepository {
  private readonly bookings: InMemoryBookingAvailabilityRecord[];

  constructor(bookings: InMemoryBookingAvailabilityRecord[] = []) {
    this.bookings = [...bookings];
  }

  async findActiveBookingsForDate(
    input: FindBookingAvailabilityInput,
  ): Promise<BookingAvailabilityRecord[]> {
    const requestedDate = normalizeDateValue(input.bookingDate);

    return this.bookings
      .filter((booking) => {
        if (booking.workspaceId !== input.workspaceId) {
          return false;
        }

        if (normalizeDateValue(booking.bookingDate) !== requestedDate) {
          return false;
        }

        if (booking.status === "CANCELLED") {
          return false;
        }

        if (input.excludeBookingId && booking.id === input.excludeBookingId) {
          return false;
        }

        return true;
      })
      .sort((left, right) => left.startTime.localeCompare(right.startTime))
      .map(({ id, startTime, endTime }) => ({
        id,
        startTime,
        endTime,
      }));
  }

  addBooking(booking: InMemoryBookingAvailabilityRecord): void {
    this.bookings.push(booking);
  }
}
