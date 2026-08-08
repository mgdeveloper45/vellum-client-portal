import { describe, expect, it, vi } from "vitest";

import { createActionRegistry } from "../action-registry-factory";

describe("createActionRegistry", () => {
  it("registers provided action handlers", () => {
    const draftEmail = {
      execute: vi.fn().mockResolvedValue({
        success: true,
        message: "Email drafted.",
      }),
    };

    const createBooking = {
      execute: vi.fn().mockResolvedValue({
        success: true,
        message: "Booking created.",
      }),
    };

    const registry = createActionRegistry({
      draftEmail,
      createBooking,
    });

    expect(registry.resolve("EMAIL")).toBe(draftEmail);

    expect(registry.resolve("BOOKING")).toBe(createBooking);
  });

  it("does not register handlers that were not provided", () => {
    const registry = createActionRegistry();

    expect(registry.resolve("EMAIL")).toBeUndefined();

    expect(registry.resolve("TASK")).toBeUndefined();

    expect(registry.resolve("BOOKING")).toBeUndefined();

    expect(registry.resolve("PROJECT")).toBeUndefined();

  });

  it("registers every supported handler", () => {
    const handler = () => ({
      execute: vi.fn().mockResolvedValue({
        success: true,
        message: "Executed.",
      }),
    });

    const draftEmail = handler();
    const createTask = handler();
    const createBooking = handler();
    const updateProject = handler();

    const registry = createActionRegistry({
      draftEmail,
      createTask,
      createBooking,
      updateProject,
    });

    expect(registry.resolve("EMAIL")).toBe(draftEmail);

    expect(registry.resolve("TASK")).toBe(createTask);

    expect(registry.resolve("BOOKING")).toBe(createBooking);

    expect(registry.resolve("PROJECT")).toBe(updateProject);

  });
});
