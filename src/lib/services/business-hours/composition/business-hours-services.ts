import { prismaBusinessHoursRepository } from "../prisma-business-hours-repository";
import { createUpdateBusinessHoursService } from "../update-business-hours-service";

export const updateBusinessHoursService = createUpdateBusinessHoursService({
  businessHoursRepository: prismaBusinessHoursRepository,
});
