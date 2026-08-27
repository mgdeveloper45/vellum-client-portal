import { describe, expect, it, vi } from "vitest";

import { DeliverWaitlistOpeningService } from "../deliver-waitlist-opening-service";
import type { WaitlistEntryRecord } from "../waitlist-repository";

const entry: WaitlistEntryRecord = {
  id: "waitlist-1",
  workspaceId: "workspace-1",
  serviceId: "service-1",

  customerName: "Ada Lovelace",
  customerEmail: "ada@example.com",
  customerPhone: null,
  notes: null,

  requestedDate: new Date("2026-09-01T00:00:00.000Z"),
  preferredStartTime: "09:00",
  preferredEndTime: "12:00",

  status: "NOTIFIED",

  notifiedAt: new Date("2026-08-26T20:00:00.000Z"),
  bookedAt: null,
  expiresAt: new Date("2026-08-26T20:30:00.000Z"),

  createdAt: new Date("2026-08-25T20:00:00.000Z"),
  updatedAt: new Date("2026-08-26T20:00:00.000Z"),
};

describe("DeliverWaitlistOpeningService", () => {
  it("sends an opening email for a successfully claimed entry", async () => {
    const notifyNext = {
      execute: vi.fn().mockResolvedValue({
        ok: true,
        entry,
      }),
    };

    const sendOpening = vi.fn().mockResolvedValue(undefined);

    const releaseClaim = vi.fn();

    const service = new DeliverWaitlistOpeningService({
      notifyNext,
      sendOpening,
      releaseClaim,
      appUrl: "https://vellum.example",
    });

    const result = await service.execute({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      workspaceSlug: "acme",
      businessName: "Acme Studio",
      serviceName: "Consultation",
      requestedDate: new Date("2026-09-01T00:00:00.000Z"),
      availableStartTime: "10:00",
    });

    expect(result).toEqual({
      ok: true,
      entry,
    });

    expect(sendOpening).toHaveBeenCalledOnce();

    expect(sendOpening).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ada@example.com",
        customerName: "Ada Lovelace",
        businessName: "Acme Studio",
        serviceName: "Consultation",
        availableTime: "10:00",
        bookingUrl:
          "https://vellum.example/book/acme?serviceId=service-1&date=2026-09-01&time=10%3A00",
      }),
    );

    expect(releaseClaim).not.toHaveBeenCalled();
  });

  it("returns no eligible entry without sending email", async () => {
    const notifyNext = {
      execute: vi.fn().mockResolvedValue({
        ok: false,
        reason: "NO_ELIGIBLE_ENTRY",
      }),
    };

    const sendOpening = vi.fn();
    const releaseClaim = vi.fn();

    const service = new DeliverWaitlistOpeningService({
      notifyNext,
      sendOpening,
      releaseClaim,
      appUrl: "https://vellum.example",
    });

    const result = await service.execute({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      workspaceSlug: "acme",
      businessName: "Acme Studio",
      serviceName: "Consultation",
      requestedDate: new Date("2026-09-01T00:00:00.000Z"),
      availableStartTime: "10:00",
    });

    expect(result).toEqual({
      ok: false,
      reason: "NO_ELIGIBLE_ENTRY",
    });

    expect(sendOpening).not.toHaveBeenCalled();
    expect(releaseClaim).not.toHaveBeenCalled();
  });

  it("releases the claim when email delivery fails", async () => {
    const notifyNext = {
      execute: vi.fn().mockResolvedValue({
        ok: true,
        entry,
      }),
    };

    const deliveryError = new Error("Resend unavailable");

    const sendOpening = vi.fn().mockRejectedValue(deliveryError);

    const releaseClaim = vi.fn().mockResolvedValue(true);

    const service = new DeliverWaitlistOpeningService({
      notifyNext,
      sendOpening,
      releaseClaim,
      appUrl: "https://vellum.example",
    });

    const result = await service.execute({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      workspaceSlug: "acme",
      businessName: "Acme Studio",
      serviceName: "Consultation",
      requestedDate: new Date("2026-09-01T00:00:00.000Z"),
      availableStartTime: "10:00",
    });

    expect(result).toEqual({
      ok: false,
      reason: "DELIVERY_FAILED",
    });

    expect(releaseClaim).toHaveBeenCalledWith({
      waitlistEntryId: "waitlist-1",
      workspaceId: "workspace-1",
    });
  });
});
