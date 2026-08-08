import { describe, expect, it } from "vitest";

import { createSession } from "../session-builder";
import { addMessage } from "../session-history";

describe("addMessage", () => {
  it("adds conversation history", () => {
    const session = createSession();

    const updated = addMessage(session, "How is revenue?");

    expect(updated.history).toEqual(["How is revenue?"]);
  });
});
