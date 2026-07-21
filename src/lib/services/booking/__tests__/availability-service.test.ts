import { describe, expect, it } from "vitest";
import {
  generateTimeSlots,
  minutesToTime,
  removeBookedSlots,
  timeToMinutes,
} from "../availability-service";

describe("timeToMinutes", () => {
  it("converts midnight", () => {
    expect(timeToMinutes("00:00")).toBe(0);
  });

  it("converts a normal time", () => {
    expect(timeToMinutes("10:30")).toBe(630);
  });

  it("converts the final minute of the day", () => {
    expect(timeToMinutes("23:59")).toBe(1439);
  });
});

describe("minutesToTime", () => {
  it("formats midnight", () => {
    expect(minutesToTime(0)).toBe("00:00");
  });

  it("formats a whole hour", () => {
    expect(minutesToTime(660)).toBe("11:00");
  });

  it("formats minutes correctly", () => {
    expect(minutesToTime(635)).toBe("10:35");
  });
});

describe("generateTimeSlots", () => {
  it("generates 30 minute slots", () => {
    expect(
      generateTimeSlots({
        openTime: "09:00",
        closeTime: "11:00",
        duration: 30,
      }),
    ).toEqual(["09:00", "09:30", "10:00", "10:30"]);
  });

  it("returns an empty array when duration exceeds available time", () => {
    expect(
      generateTimeSlots({
        openTime: "09:00",
        closeTime: "09:15",
        duration: 30,
      }),
    ).toEqual([]);
  });
});

describe("removeBookedSlots", () => {
  it("removes overlapping slots", () => {
    expect(
      removeBookedSlots({
        slots: ["09:00", "09:30", "10:00", "10:30"],
        duration: 30,
        bookings: [
          {
            startTime: "09:30",
            endTime: "10:00",
          },
        ],
      }),
    ).toEqual(["09:00", "10:00", "10:30"]);
  });

  it("returns all slots when there are no bookings", () => {
    expect(
      removeBookedSlots({
        slots: ["09:00", "09:30"],
        duration: 30,
        bookings: [],
      }),
    ).toEqual(["09:00", "09:30"]);
  });

  it("removes every overlapping slot", () => {
    expect(
      removeBookedSlots({
        slots: ["09:00", "09:30", "10:00"],
        duration: 30,
        bookings: [
          {
            startTime: "09:00",
            endTime: "10:30",
          },
        ],
      }),
    ).toEqual([]);
  });
});
