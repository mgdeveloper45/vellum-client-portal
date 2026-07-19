import type { SchedulingContext } from "../scheduling-context";
import {
  defaultSchedulingConfiguration,
} from "../scheduling-configuration";

export function createSchedulingContext(
  overrides: Partial<SchedulingContext> = {},
): SchedulingContext {
  return {
    workspaceId: "workspace-1",
    serviceId: "service-1",
    servicePrice: 100,

    configuration: defaultSchedulingConfiguration,

    bookingDate: new Date("2026-08-17T10:00:00"),

    bookingStartTime: "10:00",
    bookingEndTime: "11:00",

    staffId: "staff-1",

    bookingRules: [],

    excludeBookingId: undefined,

    isNewClient: false,
    isVip: false,
    existingBookingsToday: 0,

    ...overrides,
  };
}