import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { listServicesQuery } from "@/lib/queries/services/list-services-query";
import { prismaClientRepository } from "@/lib/services/clients/prisma-client-repository";
import { createBookingService } from "@/lib/services/booking/composition/booking-services";

import { executeBookingCommand } from "../execute-booking-command";

vi.mock("@/lib/queries/services/list-services-query", () => ({
  listServicesQuery: vi.fn(),
}));

vi.mock(
  "@/lib/services/clients/prisma-client-repository",
  () => ({
    prismaClientRepository: {
      findMany: vi.fn(),
    },
  }),
);

vi.mock(
  "@/lib/services/booking/composition/booking-services",
  () => ({
    createBookingService: {
      execute: vi.fn(),
    },
  }),
);

describe("executeBookingCommand", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(listServicesQuery).mockResolvedValue([
      {
        id: "service-1",
        workspaceId: "workspace-1",
        name: "Consultation",
        description: null,
        duration: 60,
        price: 150,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    vi.mocked(
      prismaClientRepository.findMany,
    ).mockResolvedValue([
      {
        id: "client-1",
        firstName: "Jordan",
        lastName: "Smith",
        email: "jordan@example.com",
        clientStatus: "ACTIVE",
        projectCount: 1,
      },
    ]);
  });

  it("creates a resolved booking", async () => {
    vi.mocked(
      createBookingService.execute,
    ).mockResolvedValue({
      success: true,
      bookingId: "booking-1",
      reasons: [],
    });

    const result = await executeBookingCommand(
      "Book Jordan Smith for a consultation on 2026-08-15 at 10:30 AM.",
      "workspace-1",
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Expected booking creation to succeed.");
    }

    expect(result.bookingId).toBe("booking-1");

    expect(
      createBookingService.execute,
    ).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      customerName: "Jordan Smith",
      customerEmail: "jordan@example.com",
      date: "2026-08-15",
      startTime: "10:30",
    });
  });

  it("refuses execution when information is missing", async () => {
    const result = await executeBookingCommand(
      "Book Jordan.",
      "workspace-1",
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected booking creation to fail.");
    }

    expect(result.message).toContain("service");
    expect(result.message).toContain("date");
    expect(result.message).toContain("time");

    expect(
      createBookingService.execute,
    ).not.toHaveBeenCalled();
  });

  it("returns scheduling failures without creating a false success", async () => {
    vi.mocked(
      createBookingService.execute,
    ).mockResolvedValue({
      success: false,
      reasons: ["That time is unavailable."],
    });

    const result = await executeBookingCommand(
      "Book Jordan Smith for a consultation on 2026-08-15 at 10:30 AM.",
      "workspace-1",
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected booking creation to fail.");
    }

    expect(result.message).toContain(
      "That time is unavailable.",
    );
  });
});