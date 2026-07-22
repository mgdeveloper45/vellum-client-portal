import { describe, expect, it } from "vitest";
import {
  BUSINESS_DAYS,
  DEFAULT_BUSINESS_HOURS,
} from "../../../constants/business-hours";
import type {
  BusinessHoursRepository,
  UpsertWeeklyBusinessHoursInput,
} from "../business-hours-repository";
import { createUpdateBusinessHoursService } from "../update-business-hours-service";
import type { BusinessHourConfiguration } from "../business-hours-types";

class InMemoryBusinessHoursRepository implements BusinessHoursRepository {
  savedSchedules: UpsertWeeklyBusinessHoursInput[] = [];

  async upsertWeeklySchedule(
    input: UpsertWeeklyBusinessHoursInput,
  ): Promise<void> {
    this.savedSchedules.push(input);
  }
}

function createWeeklySchedule(): BusinessHourConfiguration[] {
  return BUSINESS_DAYS.map((dayOfWeek) => ({
    dayOfWeek,
    openTime: DEFAULT_BUSINESS_HOURS.openTime,
    closeTime: DEFAULT_BUSINESS_HOURS.closeTime,
    closed: false,
  }));
}

describe("updateBusinessHoursService", () => {
  it("saves a complete weekly schedule", async () => {
    const repository = new InMemoryBusinessHoursRepository();

    const service = createUpdateBusinessHoursService({
      businessHoursRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      businessHours: createWeeklySchedule(),
    });

    expect(result).toEqual({
      success: true,
      updatedDays: 7,
    });

    expect(repository.savedSchedules).toHaveLength(1);

    expect(repository.savedSchedules[0]).toEqual({
      workspaceId: "workspace-1",
      businessHours: createWeeklySchedule(),
    });
  });

  it("rejects a schedule that does not contain all seven days", async () => {
    const repository = new InMemoryBusinessHoursRepository();

    const service = createUpdateBusinessHoursService({
      businessHoursRepository: repository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      businessHours: createWeeklySchedule().slice(0, 6),
    });

    expect(result).toEqual({
      success: false,
      reason: "INCOMPLETE_SCHEDULE",
      message: "Business hours must include all seven days.",
    });

    expect(repository.savedSchedules).toHaveLength(0);
  });

  it("rejects duplicate weekdays", async () => {
    const repository = new InMemoryBusinessHoursRepository();

    const service = createUpdateBusinessHoursService({
      businessHoursRepository: repository,
    });

    const schedule = createWeeklySchedule();

    schedule[6] = {
      ...schedule[6],
      dayOfWeek: "MONDAY",
    };

    const result = await service({
      workspaceId: "workspace-1",
      businessHours: schedule,
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected duplicate weekday validation to fail.");
    }

    expect(result.reason).toBe("DUPLICATE_DAY");
    expect(repository.savedSchedules).toHaveLength(0);
  });

  it("rejects malformed times", async () => {
    const repository = new InMemoryBusinessHoursRepository();

    const service = createUpdateBusinessHoursService({
      businessHoursRepository: repository,
    });

    const schedule = createWeeklySchedule();

    schedule[0] = {
      ...schedule[0],
      openTime: "9:00",
    };

    const result = await service({
      workspaceId: "workspace-1",
      businessHours: schedule,
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected invalid time validation to fail.");
    }

    expect(result.reason).toBe("INVALID_TIME");
    expect(repository.savedSchedules).toHaveLength(0);
  });

  it("rejects an invalid time range on an open day", async () => {
    const repository = new InMemoryBusinessHoursRepository();

    const service = createUpdateBusinessHoursService({
      businessHoursRepository: repository,
    });

    const schedule = createWeeklySchedule();

    schedule[0] = {
      ...schedule[0],
      openTime: "17:00",
      closeTime: "09:00",
    };

    const result = await service({
      workspaceId: "workspace-1",
      businessHours: schedule,
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected invalid time range validation to fail.");
    }

    expect(result.reason).toBe("INVALID_TIME_RANGE");
    expect(repository.savedSchedules).toHaveLength(0);
  });

  it("allows a closed day to preserve its configured times", async () => {
    const repository = new InMemoryBusinessHoursRepository();

    const service = createUpdateBusinessHoursService({
      businessHoursRepository: repository,
    });

    const schedule = createWeeklySchedule();

    schedule[6] = {
      ...schedule[6],
      closed: true,
      openTime: "17:00",
      closeTime: "09:00",
    };

    const result = await service({
      workspaceId: "workspace-1",
      businessHours: schedule,
    });

    expect(result).toEqual({
      success: true,
      updatedDays: 7,
    });

    expect(repository.savedSchedules[0]?.businessHours[6]).toEqual({
      dayOfWeek: "SUNDAY",
      closed: true,
      openTime: "17:00",
      closeTime: "09:00",
    });
  });

  it("propagates repository failures", async () => {
    const repository: BusinessHoursRepository = {
      async upsertWeeklySchedule() {
        throw new Error("Database unavailable");
      },
    };

    const service = createUpdateBusinessHoursService({
      businessHoursRepository: repository,
    });

    await expect(
      service({
        workspaceId: "workspace-1",
        businessHours: createWeeklySchedule(),
      }),
    ).rejects.toThrow("Database unavailable");
  });
});
