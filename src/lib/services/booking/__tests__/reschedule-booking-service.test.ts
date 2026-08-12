import { describe, expect, it, vi } from "vitest";
import type { BookingRepository } from "../booking-repository";
import { createRescheduleBookingService } from "../reschedule-booking-service";
import { RescheduleBookingErrorCode } from "../reschedule-booking-result";

const schedulingConfiguration = {} as Parameters<
  Parameters<
    typeof createRescheduleBookingService
  >[0]["schedulingProcessor"]["process"]
>[0]["configuration"];

const request = {
  bookingId: "booking-1",
  workspaceId: "workspace-1",
  date: "2026-07-24",
  startTime: "10:00",
};

interface SchedulingDecisionOverride {
  allowed: boolean;
  reasons: string[];
  warnings: string[];
}

function createDependencies(overrides?: {
  booking?: Awaited<ReturnType<BookingRepository["findForReschedule"]>>;
  schedulingDecision?: SchedulingDecisionOverride;
  updateError?: Error;
}) {
  const bookingRepository: BookingRepository = {
    create: vi.fn().mockResolvedValue({
      id: "booking-1",
    }),

    findForReschedule: vi.fn().mockResolvedValue(
      overrides?.booking === undefined
        ? {
            id: "booking-1",
            workspaceId: "workspace-1",
            serviceId: "service-1",
            service: {
              duration: 60,
              price: 120,
            },
          }
        : overrides.booking,
    ),

    reschedule: overrides?.updateError
      ? vi.fn().mockRejectedValue(overrides.updateError)
      : vi.fn().mockResolvedValue({
          id: "booking-1",
        }),

    findForStatusUpdate: vi.fn().mockResolvedValue(null),

    updateStatus: vi.fn().mockResolvedValue({
      id: "booking-1",
    }),

    findForProjectCreation: vi.fn().mockResolvedValue(null),
    linkToProject: vi.fn().mockResolvedValue(false),
  };

  const bookingRuleProvider = {
    getWorkspaceRules: vi.fn().mockResolvedValue([]),
  };

  const schedulingProcessor = {
    process: vi.fn().mockResolvedValue(
      overrides?.schedulingDecision ?? {
        allowed: true,
        reasons: [],
        warnings: [],
      },
    ),
  };

  return {
    bookingRepository,
    bookingRuleProvider,
    schedulingProcessor,
    schedulingConfiguration,
  };
}

describe("rescheduleBookingService", () => {
  it("reschedules an allowed booking", async () => {
    const dependencies = createDependencies();

    const service = createRescheduleBookingService(dependencies);

    const result = await service.execute(request);

    expect(result).toEqual({
      success: true,
      bookingId: "booking-1",
    });

    expect(
      dependencies.bookingRepository.findForReschedule,
    ).toHaveBeenCalledWith("booking-1", "workspace-1");

    expect(
      dependencies.bookingRuleProvider.getWorkspaceRules,
    ).toHaveBeenCalledWith("workspace-1");

    expect(dependencies.schedulingProcessor.process).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: "workspace-1",
        serviceId: "service-1",
        servicePrice: 120,
        bookingStartTime: "10:00",
        bookingEndTime: "11:00",
        excludeBookingId: "booking-1",
      }),
    );

    expect(dependencies.bookingRepository.reschedule).toHaveBeenCalledWith({
      bookingId: "booking-1",
      date: new Date("2026-07-24T00:00:00"),
      startTime: "10:00",
      endTime: "11:00",
    });
  });

  it("returns BOOKING_NOT_FOUND when the booking does not exist", async () => {
    const dependencies = createDependencies({
      booking: null,
    });

    const service = createRescheduleBookingService(dependencies);

    const result = await service.execute(request);

    expect(result).toEqual({
      success: false,
      code: RescheduleBookingErrorCode.BOOKING_NOT_FOUND,
      reasons: ["The booking could not be found."],
    });

    expect(dependencies.schedulingProcessor.process).not.toHaveBeenCalled();

    expect(dependencies.bookingRepository.reschedule).not.toHaveBeenCalled();
  });

  it("returns scheduling rejection reasons", async () => {
    const dependencies = createDependencies({
      schedulingDecision: {
        allowed: false,
        reasons: ["Outside business hours"],
        warnings: [],
      },
    });

    const service = createRescheduleBookingService(dependencies);

    const result = await service.execute(request);

    expect(result).toEqual({
      success: false,
      code: RescheduleBookingErrorCode.RESCHEDULE_NOT_ALLOWED,
      reasons: ["Outside business hours"],
    });

    expect(dependencies.bookingRepository.reschedule).not.toHaveBeenCalled();
  });

  it("returns BOOKING_UPDATE_FAILED when persistence fails", async () => {
    const dependencies = createDependencies({
      updateError: new Error("database unavailable"),
    });

    const service = createRescheduleBookingService(dependencies);

    const result = await service.execute(request);

    expect(result).toEqual({
      success: false,
      code: RescheduleBookingErrorCode.BOOKING_UPDATE_FAILED,
      reasons: ["The booking could not be rescheduled. Please try again."],
    });
  });

  it("calculates the booking end time from the service duration", async () => {
    const dependencies = createDependencies({
      booking: {
        id: "booking-1",
        workspaceId: "workspace-1",
        serviceId: "service-1",
        service: {
          duration: 90,
          price: 120,
        },
      },
    });

    const service = createRescheduleBookingService(dependencies);

    await service.execute(request);

    expect(dependencies.bookingRepository.reschedule).toHaveBeenCalledWith(
      expect.objectContaining({
        endTime: "11:30",
      }),
    );
  });
});
