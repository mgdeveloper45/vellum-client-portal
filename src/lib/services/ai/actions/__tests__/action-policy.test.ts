import { describe, expect, it } from "vitest";

import { getActionPolicy } from "../action-policy";

describe("getActionPolicy", () => {
  it("executes draft emails automatically", () => {
    expect(getActionPolicy("DRAFT_EMAIL")).toBe("AUTOMATIC");
  });

  it("requires confirmation for bookings", () => {
    expect(getActionPolicy("CREATE_BOOKING")).toBe("CONFIRMATION_REQUIRED");
  });

  it("requires confirmation for project updates", () => {
    expect(getActionPolicy("UPDATE_PROJECT")).toBe("CONFIRMATION_REQUIRED");
  });

  it("executes tasks automatically", () => {
    expect(getActionPolicy("CREATE_TASK")).toBe("AUTOMATIC");
  });

  it("allows NONE automatically", () => {
    expect(getActionPolicy("NONE")).toBe("AUTOMATIC");
  });
});
