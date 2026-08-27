import { describe, expect, it } from "vitest";

import {
  JoinWaitlistService,
  type WaitlistRuleProvider,
} from "../join-waitlist-service";
import type { BookingRule } from "@/lib/services/scheduling/booking-rules";
import type {
  CreateWaitlistEntryRecordInput,
  FindActiveWaitlistEntryInput,
  WaitlistEntryRecord,
  WaitlistRepository,
} from "../waitlist-repository";
import type {
  BookableService,
  ServiceRepository,
} from "@/lib/services/booking/service-repository";

const workspaceId = "workspace-1";
const serviceId = "service-1";

function createEntry(
  overrides: Partial<WaitlistEntryRecord> = {},
): WaitlistEntryRecord {
  const now = new Date("2026-08-23T12:00:00.000Z");

  return {
    id: "waitlist-1",
    workspaceId,
    serviceId,
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
  entries: WaitlistEntryRecord[] = [];
  async claimNextEligible() {
    return null;
  }

  async releaseClaim() {
    return false;
  }

  lastDuplicateInput: FindActiveWaitlistEntryInput | null = null;

  lastCreateInput: CreateWaitlistEntryRecordInput | null = null;

  async findActiveDuplicate(
    input: FindActiveWaitlistEntryInput,
  ): Promise<WaitlistEntryRecord | null> {
    this.lastDuplicateInput = input;

    return (
      this.entries.find(
        (entry) =>
          entry.workspaceId === input.workspaceId &&
          entry.serviceId === input.serviceId &&
          entry.customerEmail === input.customerEmail &&
          entry.requestedDate.getTime() === input.requestedDate.getTime() &&
          (entry.status === "WAITING" || entry.status === "NOTIFIED"),
      ) ?? null
    );
  }

  async create(
    input: CreateWaitlistEntryRecordInput,
  ): Promise<WaitlistEntryRecord> {
    this.lastCreateInput = input;

    const entry = createEntry({
      ...input,
      id: `waitlist-${this.entries.length + 1}`,
    });

    this.entries.push(entry);

    return entry;
  }

  async list() {
    return this.entries;
  }

  async cancel() {
    return false;
  }
}

class InMemoryServiceRepository implements ServiceRepository {
  constructor(private readonly services: BookableService[]) {}

  async findActiveService(
    requestedServiceId: string,
    requestedWorkspaceId: string,
  ): Promise<BookableService | null> {
    return (
      this.services.find(
        (service) =>
          service.id === requestedServiceId &&
          service.workspaceId === requestedWorkspaceId,
      ) ?? null
    );
  }

  async findActiveServices(
    requestedWorkspaceId: string,
  ): Promise<BookableService[]> {
    return this.services.filter(
      (service) => service.workspaceId === requestedWorkspaceId,
    );
  }
}

class InMemoryWaitlistRuleProvider implements WaitlistRuleProvider {
  constructor(
    private readonly rules: BookingRule[] = [
      {
        id: "waitlist-rule-1",
        name: "Allow waitlist",
        type: "ALLOW_WAITLIST",
        enabled: true,
        priority: 100,
      },
    ],
  ) {}

  async getWorkspaceRules(): Promise<BookingRule[]> {
    return this.rules;
  }
}

function createService() {
  const waitlistRepository = new InMemoryWaitlistRepository();

  const serviceRepository = new InMemoryServiceRepository([
    {
      id: serviceId,
      workspaceId,
      name: "Consultation",
      duration: 60,
      price: 150,
    },
  ]);

  return {
    service: new JoinWaitlistService(
      waitlistRepository,
      serviceRepository,
      new InMemoryWaitlistRuleProvider(),
    ),
    waitlistRepository,
  };
}

describe("JoinWaitlistService", () => {
  it("creates a waitlist entry for an active service", async () => {
    const { service, waitlistRepository } = createService();

    const result = await service.execute({
      workspaceId,
      serviceId,
      customerName: "Marcus",
      customerEmail: "Marcus@Example.com",
      customerPhone: "",
      notes: "",
      requestedDate: "2026-09-01",
      preferredStartTime: "10:00",
      preferredEndTime: "12:00",
    });

    expect(result.ok).toBe(true);

    expect(waitlistRepository.lastCreateInput).toEqual({
      workspaceId,
      serviceId,
      customerName: "Marcus",
      customerEmail: "marcus@example.com",
      customerPhone: null,
      notes: null,
      requestedDate: new Date("2026-09-01T00:00:00.000Z"),
      preferredStartTime: "10:00",
      preferredEndTime: "12:00",
    });
  });

  it("rejects an unavailable service", async () => {
    const waitlistRepository = new InMemoryWaitlistRepository();

    const service = new JoinWaitlistService(
      waitlistRepository,
      new InMemoryServiceRepository([]),
      new InMemoryWaitlistRuleProvider(),
    );

    const result = await service.execute({
      workspaceId,
      serviceId,
      customerName: "Marcus",
      customerEmail: "marcus@example.com",
      requestedDate: "2026-09-01",
    });

    expect(result).toEqual({
      ok: false,
      error: "SERVICE_NOT_FOUND",
      message: "The requested service is not available.",
    });

    expect(waitlistRepository.lastCreateInput).toBeNull();
  });

  it("rejects a direct join when the waitlist is not allowed", async () => {
    const waitlistRepository = new InMemoryWaitlistRepository();

    const serviceRepository = new InMemoryServiceRepository([
      {
        id: serviceId,
        workspaceId,
        name: "Consultation",
        duration: 60,
        price: 150,
      },
    ]);

    const service = new JoinWaitlistService(
      waitlistRepository,
      serviceRepository,
      new InMemoryWaitlistRuleProvider([]),
    );

    const result = await service.execute({
      workspaceId,
      serviceId,
      customerName: "Marcus",
      customerEmail: "marcus@example.com",
      requestedDate: "2026-09-01",
    });

    expect(result).toEqual({
      ok: false,
      error: "WAITLIST_NOT_ALLOWED",
      message: "The waitlist is not available for this service.",
    });

    expect(waitlistRepository.lastDuplicateInput).toBeNull();
    expect(waitlistRepository.lastCreateInput).toBeNull();
  });

  it("prevents an active duplicate entry", async () => {
    const { service, waitlistRepository } = createService();

    waitlistRepository.entries.push(createEntry());

    const result = await service.execute({
      workspaceId,
      serviceId,
      customerName: "Marcus",
      customerEmail: "MARCUS@example.com",
      requestedDate: "2026-09-01",
    });

    expect(result).toEqual({
      ok: false,
      error: "ALREADY_WAITLISTED",
      message: "You are already on the waitlist for this service and date.",
    });

    expect(waitlistRepository.lastCreateInput).toBeNull();

    expect(waitlistRepository.lastDuplicateInput?.customerEmail).toBe(
      "marcus@example.com",
    );
  });

  it("rejects an invalid preferred time range", async () => {
    const { service, waitlistRepository } = createService();

    const result = await service.execute({
      workspaceId,
      serviceId,
      customerName: "Marcus",
      customerEmail: "marcus@example.com",
      requestedDate: "2026-09-01",
      preferredStartTime: "14:00",
      preferredEndTime: "12:00",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe("INVALID_INPUT");
    }

    expect(waitlistRepository.lastCreateInput).toBeNull();
  });

  it("allows another entry after a previous entry is cancelled", async () => {
    const { service, waitlistRepository } = createService();

    waitlistRepository.entries.push(
      createEntry({
        status: "CANCELLED",
      }),
    );

    const result = await service.execute({
      workspaceId,
      serviceId,
      customerName: "Marcus",
      customerEmail: "marcus@example.com",
      requestedDate: "2026-09-01",
    });

    expect(result.ok).toBe(true);
    expect(waitlistRepository.entries).toHaveLength(2);
  });
});
