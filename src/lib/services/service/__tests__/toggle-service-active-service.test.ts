import { describe, expect, it, vi } from "vitest";
import type { ServiceRepository } from "../service-repository";
import { createToggleServiceActiveService } from "../toggle-service-active-service";
import { ToggleServiceActiveErrorCode } from "../toggle-service-active-result";

function createRepository(options?: {
  updated?: boolean;
  updateError?: Error;
}): ServiceRepository {
  return {
    create: vi.fn().mockResolvedValue({
      id: "service-1",
    }),

    toggleActive: options?.updateError
      ? vi.fn().mockRejectedValue(options.updateError)
      : vi.fn().mockResolvedValue(options?.updated ?? true),
  };
}

describe("toggleServiceActiveService", () => {
  it("deactivates an active service", async () => {
    const serviceRepository = createRepository();

    const service = createToggleServiceActiveService({
      serviceRepository,
    });

    const result = await service.execute({
      serviceId: "service-1",
      workspaceId: "workspace-1",
      active: true,
    });

    expect(result).toEqual({
      success: true,
      serviceId: "service-1",
      active: false,
    });

    expect(serviceRepository.toggleActive).toHaveBeenCalledWith({
      serviceId: "service-1",
      workspaceId: "workspace-1",
      active: true,
    });
  });

  it("activates an inactive service", async () => {
    const serviceRepository = createRepository();

    const service = createToggleServiceActiveService({
      serviceRepository,
    });

    const result = await service.execute({
      serviceId: "service-1",
      workspaceId: "workspace-1",
      active: false,
    });

    expect(result).toEqual({
      success: true,
      serviceId: "service-1",
      active: true,
    });
  });

  it("returns SERVICE_NOT_FOUND when no matching service is updated", async () => {
    const serviceRepository = createRepository({
      updated: false,
    });

    const service = createToggleServiceActiveService({
      serviceRepository,
    });

    const result = await service.execute({
      serviceId: "missing-service",
      workspaceId: "workspace-1",
      active: true,
    });

    expect(result).toEqual({
      success: false,
      code: ToggleServiceActiveErrorCode.SERVICE_NOT_FOUND,
      reasons: ["The service could not be found."],
    });
  });

  it("returns SERVICE_UPDATE_FAILED when persistence fails", async () => {
    const serviceRepository = createRepository({
      updateError: new Error("database unavailable"),
    });

    const service = createToggleServiceActiveService({
      serviceRepository,
    });

    const result = await service.execute({
      serviceId: "service-1",
      workspaceId: "workspace-1",
      active: true,
    });

    expect(result).toEqual({
      success: false,
      code: ToggleServiceActiveErrorCode.SERVICE_UPDATE_FAILED,
      reasons: ["The service could not be updated. Please try again."],
    });
  });
});
