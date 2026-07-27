import { describe, expect, it } from "vitest";

import { rankBusinessSignals } from "../business-signal-engine"

describe("rankBusinessSignals", () => {
  it("sorts highest score first", () => {
    const ranked = rankBusinessSignals([
      {
        id: "low",

        category: "FINANCE",

        severity: "LOW",

        title: "",

        description: "",

        recommendation: "",

        impact: 5,

        confidence: 5,

        urgency: 5,
      },

      {
        id: "critical",

        category: "PROJECTS",

        severity: "CRITICAL",

        title: "",

        description: "",

        recommendation: "",

        impact: 80,

        confidence: 90,

        urgency: 90,
      },
    ]);

    expect(ranked[0].id).toBe("critical");

    expect(ranked[1].id).toBe("low");
  });
});
