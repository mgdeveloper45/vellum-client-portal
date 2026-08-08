import { describe, expect, it } from "vitest";

import { appendCitations } from "../citation-merger";

describe("appendCitations", () => {
  it("adds evidence to an answer", () => {
    const answer = appendCitations("Revenue is healthy.", [
      {
        title: "Revenue Risk",
        value: "LOW",
      },
    ]);

    expect(answer).toContain("Evidence");

    expect(answer).toContain("Revenue Risk");
  });

  it("returns the answer unchanged when there are no citations", () => {
    expect(appendCitations("Hello", [])).toBe("Hello");
  });
});
