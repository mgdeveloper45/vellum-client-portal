import type { CreateServiceRequest } from "./create-service-request";
import {
  CreateServiceErrorCode,
  type CreateServiceResult,
} from "./create-service-result";
import type { ServiceRepository } from "./service-repository";

export interface CreateServiceServiceDependencies {
  serviceRepository: ServiceRepository;
}

export function createCreateServiceService(
  dependencies: CreateServiceServiceDependencies,
) {
  return {
    async execute(request: CreateServiceRequest): Promise<CreateServiceResult> {
      const priceInCents = Math.round(request.priceDollars * 100);

      try {
        const service = await dependencies.serviceRepository.create({
          name: request.name,
          description: request.description ?? null,
          duration: request.duration,
          price: priceInCents,
          workspaceId: request.workspaceId,
        });

        return {
          success: true,
          serviceId: service.id,
        };
      } catch (error) {
        console.error("Service creation failed", {
          workspaceId: request.workspaceId,
          error,
        });

        return {
          success: false,
          code: CreateServiceErrorCode.SERVICE_CREATE_FAILED,
          reasons: ["The service could not be created. Please try again."],
        };
      }
    },
  };
}
