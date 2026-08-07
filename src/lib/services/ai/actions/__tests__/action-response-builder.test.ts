import { describe, expect, it } from "vitest";

import { buildActionResponse } from "../action-response-builder";

describe("buildActionResponse", () => {
  it("builds a response", () => {
    const response = buildActionResponse(
      "CREATE_TASK",
      true,
      "Task created.",
      false,
    );

    expect(response.success).toBe(true);

    expect(response.action).toBe("CREATE_TASK");

    expect(response.message).toBe("Task created.");

    expect(response.requiresConfirmation).toBe(false);

    expect(response.citations).toEqual([]);
  });
});
