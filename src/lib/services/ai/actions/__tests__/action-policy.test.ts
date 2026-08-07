import { describe, expect, it } from "vitest";

import { getActionPolicy } from "../action-policy";

describe("getActionPolicy", () => {
  it("allows draft emails automatically", () => {
    expect(
      getActionPolicy("DRAFT_EMAIL"),
    ).toBe("AUTOMATIC");
  });

  it("requires confirmation for bookings", () => {
    expect(
      getActionPolicy("CREATE_BOOKING"),
    ).toBe("CONFIRMATION_REQUIRED");
  });

  it("requires confirmation for invoices", () => {
    expect(
      getActionPolicy("CREATE_INVOICE"),
    ).toBe("CONFIRMATION_REQUIRED");
  });

  it("requires confirmation for project updates", () => {
    expect(
      getActionPolicy("UPDATE_PROJECT"),
    ).toBe("CONFIRMATION_REQUIRED");
  });

  it("requires confirmation for tasks", () => {
    expect(
      getActionPolicy("CREATE_TASK"),
    ).toBe("CONFIRMATION_REQUIRED");
  });

  it("does nothing for informational requests", () => {
    expect(
      getActionPolicy("NONE"),
    ).toBe("AUTOMATIC");
  });
});