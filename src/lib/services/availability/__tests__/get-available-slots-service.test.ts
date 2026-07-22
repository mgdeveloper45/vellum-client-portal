import { describe, expect, it } from "vitest";

import type {
  BookingAvailabilityRecord,
  BookingAvailabilityRepository,
  FindBookingAvailabilityInput,
} from "../../../repositories/booking-availability-repository";
import type {
  BusinessHoursRecord,
  BusinessHoursRepository,
} from "../../business-hours/business-hours-repository";
import { createGetAvailableSlotsService } from "../get-available-slots-service";

class InMemoryBusinessHoursRepository implements BusinessHoursRepository {
  constructor(private readonly businessHours: BusinessHoursRecord | null) {}

  async findForDay(): Promise<BusinessHoursRecord | null> {
    return this.businessHours;
  }

  async upsertWeeklySchedule(): Promise<void> {}
}

class InMemoryBookingAvailabilityRepository implements BookingAvailabilityRepository {
  lastInput: FindBookingAvailabilityInput | null = null;

  constructor(private readonly bookings: BookingAvailabilityRecord[] = []) {}

  async findActiveBookingsForDate(
    input: FindBookingAvailabilityInput,
  ): Promise<BookingAvailabilityRecord[]> {
    this.lastInput = input;

    return this.bookings;
  }
}

function createOpenBusinessHours(): BusinessHoursRecord {
  return {
    dayOfWeek: "MONDAY",
    openTime: "09:00",
    closeTime: "11:00",
    closed: false,
  };
}

function createRequest() {
  return {
    workspaceId: "workspace-1",
    serviceId: "service-1",
    bookingDate: new Date("2026-07-20T00:00:00"),
    duration: 30,
  };
}

describe("getAvailableSlotsService", () => {
  it("returns available slots during configured business hours", async () => {
    const businessHoursRepository = new InMemoryBusinessHoursRepository(
      createOpenBusinessHours(),
    );

    const bookingAvailabilityRepository =
      new InMemoryBookingAvailabilityRepository();

    const service = createGetAvailableSlotsService({
      businessHoursRepository,
      bookingAvailabilityRepository,
    });

    const result = await service(createRequest());

    expect(result).toEqual({
      success: true,
      availableSlots: ["09:00", "09:30", "10:00", "10:30"],
    });
  });

  it("removes slots that overlap existing bookings", async () => {
    const businessHoursRepository = new InMemoryBusinessHoursRepository(
      createOpenBusinessHours(),
    );

    const bookingAvailabilityRepository =
      new InMemoryBookingAvailabilityRepository([
        {
          id: "booking-1",
          startTime: "09:30",
          endTime: "10:00",
        },
      ]);

    const service = createGetAvailableSlotsService({
      businessHoursRepository,
      bookingAvailabilityRepository,
    });

    const result = await service(createRequest());

    expect(result).toEqual({
      success: true,
      availableSlots: ["09:00", "10:00", "10:30"],
    });
  });

  it("returns no slots when the business is closed", async () => {
    const businessHoursRepository = new InMemoryBusinessHoursRepository({
      ...createOpenBusinessHours(),
      closed: true,
    });

    const bookingAvailabilityRepository =
      new InMemoryBookingAvailabilityRepository();

    const service = createGetAvailableSlotsService({
      businessHoursRepository,
      bookingAvailabilityRepository,
    });

    const result = await service(createRequest());

    expect(result).toEqual({
      success: true,
      availableSlots: [],
    });

    expect(bookingAvailabilityRepository.lastInput).toBeNull();
  });

  it("returns no slots when business hours are not configured", async () => {
    const businessHoursRepository = new InMemoryBusinessHoursRepository(null);

    const bookingAvailabilityRepository =
      new InMemoryBookingAvailabilityRepository();

    const service = createGetAvailableSlotsService({
      businessHoursRepository,
      bookingAvailabilityRepository,
    });

    const result = await service(createRequest());

    expect(result).toEqual({
      success: true,
      availableSlots: [],
    });
  });

  it("passes the service and excluded booking to the repository", async () => {
    const businessHoursRepository = new InMemoryBusinessHoursRepository(
      createOpenBusinessHours(),
    );

    const bookingAvailabilityRepository =
      new InMemoryBookingAvailabilityRepository();

    const service = createGetAvailableSlotsService({
      businessHoursRepository,
      bookingAvailabilityRepository,
    });

    const request = {
      ...createRequest(),
      excludeBookingId: "booking-1",
    };

    await service(request);

    expect(bookingAvailabilityRepository.lastInput).toEqual({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      bookingDate: request.bookingDate,
      excludeBookingId: "booking-1",
    });
  });

  it("rejects an invalid duration", async () => {
    const service = createGetAvailableSlotsService({
      businessHoursRepository: new InMemoryBusinessHoursRepository(
        createOpenBusinessHours(),
      ),
      bookingAvailabilityRepository:
        new InMemoryBookingAvailabilityRepository(),
    });

    const result = await service({
      ...createRequest(),
      duration: 0,
    });

    expect(result).toEqual({
      success: false,
      reason: "INVALID_DURATION",
      message: "Service duration must be a positive whole number.",
    });
  });

  it("rejects an invalid booking date", async () => {
    const service = createGetAvailableSlotsService({
      businessHoursRepository: new InMemoryBusinessHoursRepository(
        createOpenBusinessHours(),
      ),
      bookingAvailabilityRepository:
        new InMemoryBookingAvailabilityRepository(),
    });

    const result = await service({
      ...createRequest(),
      bookingDate: new Date("invalid"),
    });

    expect(result).toEqual({
      success: false,
      reason: "INVALID_DATE",
      message: "A valid booking date is required.",
    });
  });

  it("propagates repository failures", async () => {
    const businessHoursRepository: BusinessHoursRepository = {
      async findForDay() {
        throw new Error("Database unavailable");
      },

      async upsertWeeklySchedule() {},
    };

    const service = createGetAvailableSlotsService({
      businessHoursRepository,
      bookingAvailabilityRepository:
        new InMemoryBookingAvailabilityRepository(),
    });

    await expect(service(createRequest())).rejects.toThrow(
      "Database unavailable",
    );
  });
});
