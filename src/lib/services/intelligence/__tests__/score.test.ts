import { describe, expect, it } from "vitest";
import { clampScore, percentage } from "../score";

describe("clampScore", () => {
  it("keeps scores between 0 and 100", () => {
    expect(clampScore(120)).toBe(100);
    expect(clampScore(-10)).toBe(0);
    expect(clampScore(75)).toBe(75);
  });
});

describe("percentage", () => {
  it("calculates a rounded percentage", () => {
    expect(percentage(3, 4)).toBe(75);
  });

  it("returns 100 when total is zero", () => {
    expect(percentage(0, 0)).toBe(100);
  });
});
