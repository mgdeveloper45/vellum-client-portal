import { describe, expect, it } from "vitest";

import { createSession } from "../session-builder";

describe("createSession", () => {
  it("creates an empty session", () => {
    const session = createSession(() => "session-1");

    expect(session.history).toEqual([]);

    expect(session.completedActions).toEqual([]);

    expect(session.citations).toEqual([]);
  });
});
