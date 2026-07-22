import { createCreateServiceService } from "../create-service-service";
import { prismaServiceRepository } from "../prisma-service-repository";
import { createToggleServiceActiveService } from "../toggle-service-active-service";

export const createServiceService = createCreateServiceService({
  serviceRepository: prismaServiceRepository,
});

export const toggleServiceActiveService = createToggleServiceActiveService({
  serviceRepository: prismaServiceRepository,
});
