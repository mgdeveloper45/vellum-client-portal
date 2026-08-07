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

    expect(registry.resolve("DRAFT_EMAIL")).toBe(draftEmail);

    expect(registry.resolve("CREATE_BOOKING")).toBe(createBooking);
  });

  it("does not register handlers that were not provided", () => {
    const registry = createActionRegistry();

    expect(registry.resolve("DRAFT_EMAIL")).toBeUndefined();

    expect(registry.resolve("CREATE_TASK")).toBeUndefined();

    expect(registry.resolve("CREATE_BOOKING")).toBeUndefined();

    expect(registry.resolve("UPDATE_PROJECT")).toBeUndefined();

    expect(registry.resolve("CREATE_INVOICE")).toBeUndefined();
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
    const createInvoice = handler();

    const registry = createActionRegistry({
      draftEmail,
      createTask,
      createBooking,
      updateProject,
      createInvoice,
    });

    expect(registry.resolve("DRAFT_EMAIL")).toBe(draftEmail);

    expect(registry.resolve("CREATE_TASK")).toBe(createTask);

    expect(registry.resolve("CREATE_BOOKING")).toBe(createBooking);

    expect(registry.resolve("UPDATE_PROJECT")).toBe(updateProject);

    expect(registry.resolve("CREATE_INVOICE")).toBe(createInvoice);
  });
});
