import { describe, expect, it } from "vitest";
import { sortByPriority } from "../priority";

describe("sortByPriority", () => {
  it("sorts highest priority first", () => {
    const items = [
      { title: "Low", priority: "LOW" as const },
      { title: "Critical", priority: "CRITICAL" as const },
      { title: "Medium", priority: "MEDIUM" as const },
      { title: "High", priority: "HIGH" as const },
    ];

    expect(sortByPriority(items).map((item) => item.title)).toEqual([
      "Critical",
      "High",
      "Medium",
      "Low",
    ]);
  });
});
