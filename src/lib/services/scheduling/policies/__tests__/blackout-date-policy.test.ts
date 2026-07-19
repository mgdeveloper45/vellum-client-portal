import { describe, expect, it } from "vitest";

import type { BlackoutDateRecord } from "@/lib/repositories/blackout-date-repository";

import { createSchedulingContext } from "../../test-utils/create-scheduling-context";
import { createDecision } from "../../test-utils/create-scheduling-decision";
import { InMemoryBlackoutDateRepository } from "../../test-utils/in-memory-blackout-date-repository";
import { BlackoutDatePolicy } from "../blackout-date-policy";

function createBlackoutDate(
  overrides: Partial<BlackoutDateRecord> = {},
): BlackoutDateRecord {
  return {
    id: "blackout-1",
    workspaceId: "workspace-1",
    name: "Christmas Closure",
    startDate: new Date("2026-12-24T00:00:00.000Z"),
    endDate: new Date("2026-12-26T23:59:59.999Z"),
    enabled: true,
    ...overrides,
  };
}

describe("BlackoutDatePolicy", () => {
  it("allows a booking when no blackout date exists", async () => {
    const repository = new InMemoryBlackoutDateRepository();

    const policy = new BlackoutDatePolicy(repository);

    const context = createSchedulingContext({
      workspaceId: "workspace-1",
      bookingDate: new Date("2026-12-23T12:00:00.000Z"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
    expect(decision.reasons).toEqual([]);
  });

  it("rejects a booking during a single-day blackout", async () => {
    const repository = new InMemoryBlackoutDateRepository([
      createBlackoutDate({
        name: "Independence Day",
        startDate: new Date("2026-07-04T00:00:00.000Z"),
        endDate: new Date("2026-07-04T23:59:59.999Z"),
      }),
    ]);

    const policy = new BlackoutDatePolicy(repository);

    const context = createSchedulingContext({
      workspaceId: "workspace-1",
      bookingDate: new Date("2026-07-04T14:00:00.000Z"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(false);

    expect(decision.reasons).toEqual([
      'Bookings are unavailable during the "Independence Day" blackout period.',
    ]);
  });

  it("rejects a booking during a multi-day blackout", async () => {
    const repository = new InMemoryBlackoutDateRepository([
      createBlackoutDate(),
    ]);

    const policy = new BlackoutDatePolicy(repository);

    const context = createSchedulingContext({
      workspaceId: "workspace-1",
      bookingDate: new Date("2026-12-25T15:00:00.000Z"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(false);

    expect(decision.reasons).toContain(
      'Bookings are unavailable during the "Christmas Closure" blackout period.',
    );
  });

  it("ignores a disabled blackout date", async () => {
    const repository = new InMemoryBlackoutDateRepository([
      createBlackoutDate({
        enabled: false,
      }),
    ]);

    const policy = new BlackoutDatePolicy(repository);

    const context = createSchedulingContext({
      workspaceId: "workspace-1",
      bookingDate: new Date("2026-12-25T15:00:00.000Z"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
    expect(decision.reasons).toEqual([]);
  });

  it("ignores blackout dates belonging to another workspace", async () => {
    const repository = new InMemoryBlackoutDateRepository([
      createBlackoutDate({
        workspaceId: "workspace-2",
      }),
    ]);

    const policy = new BlackoutDatePolicy(repository);

    const context = createSchedulingContext({
      workspaceId: "workspace-1",
      bookingDate: new Date("2026-12-25T15:00:00.000Z"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
    expect(decision.reasons).toEqual([]);
  });

  it("allows a booking after the blackout period ends", async () => {
    const repository = new InMemoryBlackoutDateRepository([
      createBlackoutDate(),
    ]);

    const policy = new BlackoutDatePolicy(repository);

    const context = createSchedulingContext({
      workspaceId: "workspace-1",
      bookingDate: new Date("2026-12-27T12:00:00.000Z"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
    expect(decision.reasons).toEqual([]);
  });
});
