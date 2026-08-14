import { describe, expect, it, vi } from "vitest";

import { createGetBookingCommandCenter } from "../booking-command-center";
import type {
  BookingCommandCenterBooking,
  BookingCommandCenterRepository,
} from "../booking-command-center-repository";

function buildBooking(
  overrides: Partial<BookingCommandCenterBooking> = {},
): BookingCommandCenterBooking {
  return {
    id: "booking-1",
    customerName: "Marcus Gillespie",
    customerEmail: "marcus@example.com",
    customerPhone: "415-555-0100",
    notes: "Test booking",
    status: "CONFIRMED",
    createdAt: new Date("2026-08-01T12:00:00.000Z"),

    depositRequired: true,
    depositAmount: 120,

    date: new Date("2026-08-20T12:00:00.000Z"),
    startTime: "10:00",
    endTime: "11:00",
    googleCalendarEventId: "calendar-event-1",

    service: {
      name: "Signature Service",
    },

    workspace: {
      name: "Vellum",
      companyName: "Vellum Studio",
    },

    project: null,

    ...overrides,
  };
}

function createRepository(
  booking: BookingCommandCenterBooking | null,
): BookingCommandCenterRepository {
  return {
    findBooking: vi.fn().mockResolvedValue(booking),
  };
}

describe("getBookingCommandCenter", () => {
  it("returns null when the booking does not exist", async () => {
    const repository = createRepository(null);

    const getBookingCommandCenter = createGetBookingCommandCenter({
      bookingCommandCenterRepository: repository,
    });

    const result = await getBookingCommandCenter({
      bookingId: "missing-booking",
      workspaceId: "workspace-1",
    });

    expect(result).toBeNull();

    expect(repository.findBooking).toHaveBeenCalledWith({
      bookingId: "missing-booking",
      workspaceId: "workspace-1",
    });
  });

  it("returns empty project state when the booking has no linked project", async () => {
    const repository = createRepository(
      buildBooking({
        project: null,
      }),
    );

    const getBookingCommandCenter = createGetBookingCommandCenter({
      bookingCommandCenterRepository: repository,
    });

    const result = await getBookingCommandCenter({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
    });

    expect(result).not.toBeNull();

    expect(result?.project).toBeNull();
    expect(result?.invoices).toEqual([]);
    expect(result?.messages).toEqual([]);
    expect(result?.files).toEqual([]);
    expect(result?.deposits).toEqual([]);

    expect(result?.flags).toMatchObject({
      hasProject: false,
      hasInvoice: false,
      invoicePaid: false,
      hasMessages: false,
      hasFiles: false,
      hasDeposit: false,
      depositPaid: false,
      calendarSynced: true,
    });

    expect(result?.financials).toEqual({
      depositRequired: true,
      depositAmount: 120,
      hasDeposit: false,
      depositTotalRequested: 0,
      depositTotalPaid: 0,
      depositOutstanding: 0,
      depositPaid: false,
    });
  });

  it("derives project, invoice, message, and file state from the linked project", async () => {
    const repository = createRepository(
      buildBooking({
        project: {
          id: "project-1",
          invoices: [
            { id: "invoice-1", paid: true },
            { id: "invoice-2", paid: true },
          ],
          messages: [{ id: "message-1" }],
          files: [{ id: "file-1" }],
          deposits: [],
        },
      }),
    );

    const getBookingCommandCenter = createGetBookingCommandCenter({
      bookingCommandCenterRepository: repository,
    });

    const result = await getBookingCommandCenter({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
    });

    expect(result?.flags).toMatchObject({
      hasProject: true,
      hasInvoice: true,
      invoicePaid: true,
      hasMessages: true,
      hasFiles: true,
    });

    expect(result?.invoices).toHaveLength(2);
    expect(result?.messages).toHaveLength(1);
    expect(result?.files).toHaveLength(1);
  });

  it("does not mark invoices paid when any linked invoice is unpaid", async () => {
    const repository = createRepository(
      buildBooking({
        project: {
          id: "project-1",
          invoices: [
            { id: "invoice-1", paid: true },
            { id: "invoice-2", paid: false },
          ],
          messages: [],
          files: [],
          deposits: [],
        },
      }),
    );

    const getBookingCommandCenter = createGetBookingCommandCenter({
      bookingCommandCenterRepository: repository,
    });

    const result = await getBookingCommandCenter({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
    });

    expect(result?.flags.hasInvoice).toBe(true);
    expect(result?.flags.invoicePaid).toBe(false);
  });

  it("calculates aggregate deposit financial state", async () => {
    const repository = createRepository(
      buildBooking({
        depositRequired: true,
        depositAmount: 300,

        project: {
          id: "project-1",
          invoices: [],
          messages: [],
          files: [],
          deposits: [
            {
              amount: 200,
              status: "PAID",
              payments: [
                {
                  amount: 125,
                },
                {
                  amount: 75,
                },
              ],
            },
            {
              amount: 100,
              status: "PARTIALLY_PAID",
              payments: [
                {
                  amount: 40,
                },
              ],
            },
          ],
        },
      }),
    );

    const getBookingCommandCenter = createGetBookingCommandCenter({
      bookingCommandCenterRepository: repository,
    });

    const result = await getBookingCommandCenter({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
    });

    expect(result?.financials).toEqual({
      depositRequired: true,
      depositAmount: 300,
      hasDeposit: true,
      depositTotalRequested: 300,
      depositTotalPaid: 240,
      depositOutstanding: 60,
      depositPaid: false,
    });

    expect(result?.flags.hasDeposit).toBe(true);
    expect(result?.flags.depositPaid).toBe(false);
  });

  it("marks deposits paid only when every linked deposit is paid", async () => {
    const repository = createRepository(
      buildBooking({
        project: {
          id: "project-1",
          invoices: [],
          messages: [],
          files: [],
          deposits: [
            {
              amount: 200,
              status: "PAID",
              payments: [
                {
                  amount: 200,
                },
              ],
            },
            {
              amount: 100,
              status: "PAID",
              payments: [
                {
                  amount: 100,
                },
              ],
            },
          ],
        },
      }),
    );

    const getBookingCommandCenter = createGetBookingCommandCenter({
      bookingCommandCenterRepository: repository,
    });

    const result = await getBookingCommandCenter({
      bookingId: "booking-1",
      workspaceId: "workspace-1",
    });

    expect(result?.financials.depositTotalRequested).toBe(300);
    expect(result?.financials.depositTotalPaid).toBe(300);
    expect(result?.financials.depositOutstanding).toBe(0);
    expect(result?.financials.depositPaid).toBe(true);

    expect(result?.flags.hasDeposit).toBe(true);
    expect(result?.flags.depositPaid).toBe(true);
  });
});
