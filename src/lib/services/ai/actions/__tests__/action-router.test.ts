import { describe, expect, it } from "vitest";

import { routeAiAction } from "../action-router";

describe("routeAiAction", () => {
  it("routes email actions", () => {
    expect(routeAiAction("Email the client").type).toBe("DRAFT_EMAIL");
  });

  it("routes task actions", () => {
    expect(routeAiAction("Create a follow up task").type).toBe("CREATE_TASK");
  });

  it("routes booking actions", () => {
    expect(routeAiAction("Schedule an appointment").type).toBe(
      "CREATE_BOOKING",
    );
  });

  it("routes invoice actions", () => {
    const action = routeAiAction("Create an invoice");

    expect(action.type).toBe("DRAFT_EMAIL");
    expect(action.executor).toBe("EMAIL");
  });

  it("returns NONE for informational questions", () => {
    expect(routeAiAction("How is revenue?").type).toBe("NONE");
  });
});
