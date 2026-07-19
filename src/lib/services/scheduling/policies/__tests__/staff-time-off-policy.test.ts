import { describe, expect, it } from "vitest";

import { StaffTimeOffPolicy } from "../staff-time-off-policy";

import { createSchedulingContext } from "../../test-utils/create-scheduling-context";
import { createDecision } from "../../test-utils/create-scheduling-decision";
import { InMemoryStaffTimeOffRepository } from "../../test-utils/in-memory-staff-time-off-repository";

describe("StaffTimeOffPolicy", () => {
  it("allows booking when no time off exists", async () => {
    const repository = new InMemoryStaffTimeOffRepository();

    const policy = new StaffTimeOffPolicy(repository);

    const context = createSchedulingContext({
      staffId: "staff-1",
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
    expect(decision.reasons).toHaveLength(0);
  });

  it("blocks booking during staff time off", async () => {
    const repository = new InMemoryStaffTimeOffRepository([
      {
        id: "1",
        workspaceId: "workspace-1",
        staffId: "staff-1",
        reason: "Vacation",
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-08-05"),
        enabled: true,
      },
    ]);

    const policy = new StaffTimeOffPolicy(repository);

    const context = createSchedulingContext({
      staffId: "staff-1",
      bookingDate: new Date("2026-08-03"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toContain(
      "The selected staff member is unavailable.",
    );
  });

  it("ignores disabled time off", async () => {
    const repository = new InMemoryStaffTimeOffRepository([
      {
        id: "1",
        workspaceId: "workspace-1",
        staffId: "staff-1",
        reason: null,
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-08-05"),
        enabled: false,
      },
    ]);

    const policy = new StaffTimeOffPolicy(repository);

    const context = createSchedulingContext({
      staffId: "staff-1",
      bookingDate: new Date("2026-08-03"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
  });

  it("ignores time off for another staff member", async () => {
    const repository = new InMemoryStaffTimeOffRepository([
      {
        id: "1",
        workspaceId: "workspace-1",
        staffId: "staff-2",
        reason: null,
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-08-05"),
        enabled: true,
      },
    ]);

    const policy = new StaffTimeOffPolicy(repository);

    const context = createSchedulingContext({
      staffId: "staff-1",
      bookingDate: new Date("2026-08-03"),
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
  });

  it("skips evaluation when no staff is selected", async () => {
    const repository = new InMemoryStaffTimeOffRepository();

    const policy = new StaffTimeOffPolicy(repository);

    const context = createSchedulingContext({
      staffId: undefined,
    });

    const decision = createDecision();

    await policy.evaluate(context, decision);

    expect(decision.allowed).toBe(true);
  });
});
