import { describe, expect, it, vi } from "vitest";
import type { BookingRepository } from "../booking-repository";
import { createCreateBookingService } from "../create-booking-service";
import { BookingErrorCode } from "../booking-result";

const schedulingConfiguration = {} as Parameters<
  Parameters<typeof createCreateBookingService>[0]["schedulingProcessor"]["process"]
>[0]["configuration"];

const request = {
  workspaceId: "workspace-1",
  serviceId: "service-1",
  customerName: "Jordan Lee",
  customerEmail: "jordan@example.com",
  customerPhone: "4155550100",
  notes: "First visit",
  date: "2026-07-24",
  startTime: "10:00",
};

function createDependencies(overrides?: {
  service?: Awaited<ReturnType<BookingRepository["findActiveService"]>>;
  schedulingDecision?: {
    allowed: boolean;
    reasons: string[];
    warnings: string[];
    deposit?: {
      required: boolean;
      amount: number;
      reason: string;
    };
  };
  createError?: Error;
}) {
  const bookingRepository: BookingRepository = {
    findActiveService: vi.fn().mockResolvedValue(
      overrides?.service === undefined
        ? {
            id: "service-1",
            workspaceId: "workspace-1",
            name: "Signature Service",
            duration: 60,
            price: 120,
          }
        : overrides.service,
    ),
    create: overrides?.createError
      ? vi.fn().mockRejectedValue(overrides.createError)
      : vi.fn().mockResolvedValue({ id: "booking-1" }),
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
        deposit: {
          required: false,
          amount: 0,
          reason: "No deposit required",
        },
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

describe("createBookingService", () => {
  it("creates an allowed booking and returns its identifier", async () => {
    const dependencies = createDependencies();
    const service = createCreateBookingService(dependencies);

    const result = await service.execute(request);

    expect(result).toEqual({
      success: true,
      bookingId: "booking-1",
    });
    expect(dependencies.bookingRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: "10:00",
        endTime: "11:00",
        serviceId: "service-1",
        workspaceId: "workspace-1",
      }),
    );
  });

  it("returns SERVICE_NOT_FOUND when the service is unavailable", async () => {
    const dependencies = createDependencies({ service: null });
    const service = createCreateBookingService(dependencies);

    const result = await service.execute(request);

    expect(result.success).toBe(false);
    expect(result.code).toBe(BookingErrorCode.SERVICE_NOT_FOUND);
    expect(dependencies.schedulingProcessor.process).not.toHaveBeenCalled();
    expect(dependencies.bookingRepository.create).not.toHaveBeenCalled();
  });

  it("returns scheduling reasons when the booking is rejected", async () => {
    const dependencies = createDependencies({
      schedulingDecision: {
        allowed: false,
        reasons: ["Outside business hours"],
        warnings: [],
      },
    });
    const service = createCreateBookingService(dependencies);

    const result = await service.execute(request);

    expect(result).toEqual({
      success: false,
      code: BookingErrorCode.BOOKING_NOT_ALLOWED,
      reasons: ["Outside business hours"],
    });
    expect(dependencies.bookingRepository.create).not.toHaveBeenCalled();
  });

  it("returns DEPOSIT_CALCULATION_FAILED when no deposit decision exists", async () => {
    const dependencies = createDependencies({
      schedulingDecision: {
        allowed: true,
        reasons: [],
        warnings: [],
      },
    });
    const service = createCreateBookingService(dependencies);

    const result = await service.execute(request);

    expect(result.code).toBe(BookingErrorCode.DEPOSIT_CALCULATION_FAILED);
    expect(dependencies.bookingRepository.create).not.toHaveBeenCalled();
  });

  it("returns BOOKING_CREATE_FAILED when persistence fails", async () => {
    const dependencies = createDependencies({
      createError: new Error("database unavailable"),
    });
    const service = createCreateBookingService(dependencies);

    const result = await service.execute(request);

    expect(result.success).toBe(false);
    expect(result.code).toBe(BookingErrorCode.BOOKING_CREATE_FAILED);
  });
});
