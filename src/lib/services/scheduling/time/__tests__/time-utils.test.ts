import { describe, expect, it } from "vitest";
import {
  addMinutes,
  compareTimes,
  convertTimeToMinutes,
  isValidTime,
  isWithinTimeRange,
  minutesBetween,
  subtractMinutes,
} from "../time-utils";

describe("convertTimeToMinutes", () => {
  it("converts midnight to zero minutes", () => {
    expect(convertTimeToMinutes("00:00")).toBe(0);
  });

  it("converts a normal time", () => {
    expect(convertTimeToMinutes("10:30")).toBe(630);
  });

  it("converts the final valid minute of the day", () => {
    expect(convertTimeToMinutes("23:59")).toBe(1439);
  });

  it("rejects a time without leading zeroes", () => {
    expect(convertTimeToMinutes("9:30")).toBeNull();
  });

  it("rejects a time with invalid formatting", () => {
    expect(convertTimeToMinutes("09-30")).toBeNull();
  });

  it("rejects an hour greater than 23", () => {
    expect(convertTimeToMinutes("24:00")).toBeNull();
  });

  it("rejects minutes greater than 59", () => {
    expect(convertTimeToMinutes("09:60")).toBeNull();
  });

  it("rejects non-numeric values", () => {
    expect(convertTimeToMinutes("aa:bb")).toBeNull();
  });
});

describe("isValidTime", () => {
  it("returns true for a valid time", () => {
    expect(isValidTime("14:45")).toBe(true);
  });

  it("returns false for an invalid time", () => {
    expect(isValidTime("25:00")).toBe(false);
  });
});

describe("isWithinTimeRange", () => {
  it("returns true when the value is inside the range", () => {
    expect(isWithinTimeRange(600, 540, 660)).toBe(true);
  });

  it("includes the start boundary", () => {
    expect(isWithinTimeRange(540, 540, 660)).toBe(true);
  });

  it("includes the end boundary", () => {
    expect(isWithinTimeRange(660, 540, 660)).toBe(true);
  });

  it("returns false when the value is before the range", () => {
    expect(isWithinTimeRange(539, 540, 660)).toBe(false);
  });

  it("returns false when the value is after the range", () => {
    expect(isWithinTimeRange(661, 540, 660)).toBe(false);
  });
});

describe("compareTimes", () => {
  it("returns a negative number when the left time is earlier", () => {
    expect(compareTimes("09:00", "10:00")).toBe(-60);
  });

  it("returns zero when both times are equal", () => {
    expect(compareTimes("10:00", "10:00")).toBe(0);
  });

  it("returns a positive number when the left time is later", () => {
    expect(compareTimes("11:30", "10:00")).toBe(90);
  });

  it("returns null when the left time is invalid", () => {
    expect(compareTimes("invalid", "10:00")).toBeNull();
  });

  it("returns null when the right time is invalid", () => {
    expect(compareTimes("10:00", "invalid")).toBeNull();
  });
});

describe("minutesBetween", () => {
  it("returns the number of minutes between two times", () => {
    expect(minutesBetween("09:00", "10:30")).toBe(90);
  });

  it("returns zero when both times are equal", () => {
    expect(minutesBetween("09:00", "09:00")).toBe(0);
  });

  it("returns a negative number when the end time is earlier", () => {
    expect(minutesBetween("10:00", "09:00")).toBe(-60);
  });

  it("returns null when the start time is invalid", () => {
    expect(minutesBetween("invalid", "10:00")).toBeNull();
  });

  it("returns null when the end time is invalid", () => {
    expect(minutesBetween("10:00", "invalid")).toBeNull();
  });
});

describe("addMinutes", () => {
  it("adds minutes without crossing an hour", () => {
    expect(addMinutes("09:00", 30)).toBe("09:30");
  });

  it("adds minutes across an hour boundary", () => {
    expect(addMinutes("09:45", 30)).toBe("10:15");
  });

  it("supports adding zero minutes", () => {
    expect(addMinutes("09:45", 0)).toBe("09:45");
  });

  it("supports subtracting minutes with a negative value", () => {
    expect(addMinutes("10:00", -30)).toBe("09:30");
  });

  it("returns null for an invalid time", () => {
    expect(addMinutes("invalid", 30)).toBeNull();
  });

  it("returns null when the result is before midnight", () => {
    expect(addMinutes("00:15", -30)).toBeNull();
  });

  it("returns null when the result reaches the next day", () => {
    expect(addMinutes("23:45", 15)).toBeNull();
  });

  it("allows the final valid minute of the day", () => {
    expect(addMinutes("23:58", 1)).toBe("23:59");
  });
});

describe("subtractMinutes", () => {
  it("subtracts minutes from a numeric value", () => {
    expect(subtractMinutes(600, 30)).toBe(570);
  });

  it("can return a negative number", () => {
    expect(subtractMinutes(15, 30)).toBe(-15);
  });

  it("returns the original value when subtracting zero", () => {
    expect(subtractMinutes(600, 0)).toBe(600);
  });
});
