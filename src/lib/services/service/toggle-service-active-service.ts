import type { ServiceRepository } from "./service-repository";
import type { ToggleServiceActiveRequest } from "./toggle-service-active-request";
import {
  ToggleServiceActiveErrorCode,
  type ToggleServiceActiveResult,
} from "./toggle-service-active-result";

export interface ToggleServiceActiveServiceDependencies {
  serviceRepository: ServiceRepository;
}

export function createToggleServiceActiveService(
  dependencies: ToggleServiceActiveServiceDependencies,
) {
  return {
    async execute(
      request: ToggleServiceActiveRequest,
    ): Promise<ToggleServiceActiveResult> {
      try {
        const updated = await dependencies.serviceRepository.toggleActive({
          serviceId: request.serviceId,
          workspaceId: request.workspaceId,
          active: request.active,
        });

        if (!updated) {
          return {
            success: false,
            code: ToggleServiceActiveErrorCode.SERVICE_NOT_FOUND,
            reasons: ["The service could not be found."],
          };
        }

        return {
          success: true,
          serviceId: request.serviceId,
          active: !request.active,
        };
      } catch (error) {
        console.error("Service active status update failed", {
          serviceId: request.serviceId,
          workspaceId: request.workspaceId,
          error,
        });

        return {
          success: false,
          code: ToggleServiceActiveErrorCode.SERVICE_UPDATE_FAILED,
          reasons: ["The service could not be updated. Please try again."],
        };
      }
    },
  };
}
