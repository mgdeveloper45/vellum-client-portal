import { describe, expect, it, vi } from "vitest";
import { createCreateServiceService } from "../create-service-service";
import { CreateServiceErrorCode } from "../create-service-result";
import type { ServiceRepository } from "../service-repository";

function createRepository(options?: {
  createError?: Error;
}): ServiceRepository {
  return {
    create: options?.createError
      ? vi.fn().mockRejectedValue(options.createError)
      : vi.fn().mockResolvedValue({
          id: "service-1",
        }),

    toggleActive: vi.fn().mockResolvedValue(true),
  };
}

describe("createServiceService", () => {
  it("creates a service and converts dollars to cents", async () => {
    const serviceRepository = createRepository();

    const service = createCreateServiceService({
      serviceRepository,
    });

    const result = await service.execute({
      workspaceId: "workspace-1",
      name: "Signature Service",
      description: "A premium service",
      duration: 60,
      priceDollars: 120.5,
    });

    expect(result).toEqual({
      success: true,
      serviceId: "service-1",
    });

    expect(serviceRepository.create).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      name: "Signature Service",
      description: "A premium service",
      duration: 60,
      price: 12050,
    });
  });

  it("stores a missing description as null", async () => {
    const serviceRepository = createRepository();

    const service = createCreateServiceService({
      serviceRepository,
    });

    await service.execute({
      workspaceId: "workspace-1",
      name: "Consultation",
      duration: 30,
      priceDollars: 50,
    });

    expect(serviceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: null,
      }),
    );
  });

  it("rounds fractional cents", async () => {
    const serviceRepository = createRepository();

    const service = createCreateServiceService({
      serviceRepository,
    });

    await service.execute({
      workspaceId: "workspace-1",
      name: "Consultation",
      duration: 30,
      priceDollars: 19.999,
    });

    expect(serviceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        price: 2000,
      }),
    );
  });

  it("returns SERVICE_CREATE_FAILED when persistence fails", async () => {
    const serviceRepository = createRepository({
      createError: new Error("database unavailable"),
    });

    const service = createCreateServiceService({
      serviceRepository,
    });

    const result = await service.execute({
      workspaceId: "workspace-1",
      name: "Signature Service",
      duration: 60,
      priceDollars: 120,
    });

    expect(result).toEqual({
      success: false,
      code: CreateServiceErrorCode.SERVICE_CREATE_FAILED,
      reasons: ["The service could not be created. Please try again."],
    });
  });
});
