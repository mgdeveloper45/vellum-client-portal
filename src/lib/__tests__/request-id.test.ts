import { describe, expect, it } from "vitest";
import { createRequestId } from "../request-id";

describe("createRequestId", () => {
  it("creates unique ids", () => {
    const first = createRequestId();
    const second = createRequestId();

    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThan(20);
  });
});
