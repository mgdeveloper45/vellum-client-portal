import { describe, expect, it, vi } from "vitest";

import { NotifyNextWaitlistEntryService } from "../notify-next-waitlist-entry-service";
import type {
  ClaimNextWaitlistEntryInput,
  WaitlistEntryRecord,
  WaitlistRepository,
} from "../waitlist-repository";

function createEntry(): WaitlistEntryRecord {
  const now = new Date("2026-08-27T01:00:00.000Z");

  return {
    id: "waitlist-1",
    workspaceId: "workspace-1",
    serviceId: "service-1",

    customerName: "Marcus",
    customerEmail: "marcus@example.com",
    customerPhone: null,
    notes: null,

    requestedDate: new Date("2026-08-28T00:00:00.000Z"),

    preferredStartTime: "10:00",
    preferredEndTime: "12:00",

    status: "NOTIFIED",

    notifiedAt: now,
    bookedAt: null,
    expiresAt: new Date("2026-08-27T01:30:00.000Z"),

    createdAt: now,
    updatedAt: now,
  };
}

describe("NotifyNextWaitlistEntryService", () => {
  it("claims the next eligible waitlist entry", async () => {
    const entry = createEntry();

    const claimNextEligible = vi.fn().mockResolvedValue(entry);

    const repository = {
      claimNextEligible,
    } as unknown as WaitlistRepository;

    const now = new Date("2026-08-27T01:00:00.000Z");

    const service = new NotifyNextWaitlistEntryService(repository, () => now);

    const requestedDate = new Date("2026-08-28T00:00:00.000Z");

    const result = await service.execute({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      requestedDate,
      availableStartTime: "10:30",
    });

    expect(result).toEqual({
      ok: true,
      entry,
    });

    expect(claimNextEligible).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      requestedDate,
      availableStartTime: "10:30",
      notifiedAt: now,
      expiresAt: new Date("2026-08-27T01:30:00.000Z"),
    } satisfies ClaimNextWaitlistEntryInput);
  });

  it("returns no eligible entry when nobody can claim the slot", async () => {
    const repository = {
      claimNextEligible: vi.fn().mockResolvedValue(null),
    } as unknown as WaitlistRepository;

    const service = new NotifyNextWaitlistEntryService(
      repository,
      () => new Date("2026-08-27T01:00:00.000Z"),
    );

    const result = await service.execute({
      workspaceId: "workspace-1",
      serviceId: "service-1",
      requestedDate: new Date("2026-08-28T00:00:00.000Z"),
      availableStartTime: "10:30",
    });

    expect(result).toEqual({
      ok: false,
      reason: "NO_ELIGIBLE_ENTRY",
    });
  });
});
