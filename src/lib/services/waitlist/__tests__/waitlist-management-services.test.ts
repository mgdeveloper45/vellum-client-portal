import { describe, expect, it } from "vitest";

import { CancelWaitlistService } from "../cancel-waitlist-service";
import { ListWaitlistService } from "../list-waitlist-service";

import type {
  CancelWaitlistEntryInput,
  CreateWaitlistEntryRecordInput,
  FindActiveWaitlistEntryInput,
  ListWaitlistEntriesInput,
  WaitlistEntryRecord,
  WaitlistRepository,
} from "../waitlist-repository";

const workspaceId = "workspace-1";

function entry(
  overrides: Partial<WaitlistEntryRecord> = {},
): WaitlistEntryRecord {
  const now = new Date("2026-08-23T12:00:00.000Z");

  return {
    id: "waitlist-1",
    workspaceId,
    serviceId: "service-1",
    customerName: "Marcus",
    customerEmail: "marcus@example.com",
    customerPhone: null,
    notes: null,
    requestedDate: new Date("2026-09-01T00:00:00.000Z"),
    preferredStartTime: null,
    preferredEndTime: null,
    status: "WAITING",
    notifiedAt: null,
    bookedAt: null,
    expiresAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

class InMemoryWaitlistRepository implements WaitlistRepository {
  constructor(public entries: WaitlistEntryRecord[]) {}
  async claimNextEligible() {
    return null;
  }

  async releaseClaim() {
    return false;
  }

  lastListInput: ListWaitlistEntriesInput | null = null;

  async findActiveDuplicate(..._args: [FindActiveWaitlistEntryInput]) {
    void _args;
    return null;
  }

  async create(
    ..._args: [CreateWaitlistEntryRecordInput]
  ): Promise<WaitlistEntryRecord> {
    void _args;
    throw new Error("Not implemented in this test.");
  }

  async list(input: ListWaitlistEntriesInput): Promise<WaitlistEntryRecord[]> {
    this.lastListInput = input;

    return this.entries.filter(
      (item) =>
        item.workspaceId === input.workspaceId &&
        (!input.serviceId || item.serviceId === input.serviceId) &&
        (!input.status || item.status === input.status),
    );
  }

  async cancel(input: CancelWaitlistEntryInput): Promise<boolean> {
    const target = this.entries.find(
      (item) =>
        item.id === input.waitlistEntryId &&
        item.workspaceId === input.workspaceId &&
        (item.status === "WAITING" || item.status === "NOTIFIED"),
    );

    if (!target) {
      return false;
    }

    target.status = "CANCELLED";

    return true;
  }
}

describe("ListWaitlistService", () => {
  it("lists entries scoped to the workspace", async () => {
    const repository = new InMemoryWaitlistRepository([
      entry(),
      entry({
        id: "waitlist-2",
        workspaceId: "workspace-2",
      }),
    ]);

    const service = new ListWaitlistService(repository);

    const result = await service.execute({
      workspaceId,
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("waitlist-1");

    expect(repository.lastListInput).toEqual({
      workspaceId,
      serviceId: undefined,
      status: undefined,
    });
  });

  it("supports service and status filters", async () => {
    const repository = new InMemoryWaitlistRepository([
      entry(),
      entry({
        id: "waitlist-2",
        serviceId: "service-2",
      }),
      entry({
        id: "waitlist-3",
        status: "CANCELLED",
      }),
    ]);

    const service = new ListWaitlistService(repository);

    const result = await service.execute({
      workspaceId,
      serviceId: "service-1",
      status: "WAITING",
    });

    expect(result.map((item) => item.id)).toEqual(["waitlist-1"]);
  });
});

describe("CancelWaitlistService", () => {
  it("cancels an active waitlist entry", async () => {
    const target = entry();

    const repository = new InMemoryWaitlistRepository([target]);

    const service = new CancelWaitlistService(repository);

    const result = await service.execute({
      workspaceId,
      waitlistEntryId: target.id,
    });

    expect(result).toEqual({
      ok: true,
    });

    expect(target.status).toBe("CANCELLED");
  });

  it("does not cancel an entry from another workspace", async () => {
    const target = entry();

    const repository = new InMemoryWaitlistRepository([target]);

    const service = new CancelWaitlistService(repository);

    const result = await service.execute({
      workspaceId: "workspace-2",
      waitlistEntryId: target.id,
    });

    expect(result).toEqual({
      ok: false,
      error: "NOT_FOUND",
      message: "The waitlist entry could not be cancelled.",
    });

    expect(target.status).toBe("WAITING");
  });

  it("does not cancel a completed waitlist entry", async () => {
    const target = entry({
      status: "BOOKED",
    });

    const repository = new InMemoryWaitlistRepository([target]);

    const service = new CancelWaitlistService(repository);

    const result = await service.execute({
      workspaceId,
      waitlistEntryId: target.id,
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe("NOT_FOUND");
    }

    expect(target.status).toBe("BOOKED");
  });

  it("rejects an empty waitlist entry id", async () => {
    const repository = new InMemoryWaitlistRepository([]);

    const service = new CancelWaitlistService(repository);

    const result = await service.execute({
      workspaceId,
      waitlistEntryId: "",
    });

    expect(result).toEqual({
      ok: false,
      error: "INVALID_INPUT",
      message: "Invalid waitlist entry.",
    });
  });
});
