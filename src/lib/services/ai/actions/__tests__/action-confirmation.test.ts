import { describe, expect, it } from "vitest";

import { buildActionConfirmation } from "../action-confirmation";

describe("buildActionConfirmation", () => {
  it("builds a confirmation model", () => {
    const confirmation = buildActionConfirmation("CREATE_BOOKING");

    expect(confirmation.requiresConfirmation).toBe(true);

    expect(confirmation.action).toBe("CREATE_BOOKING");

    expect(confirmation.title).toBe("Create Booking");
  });
});
