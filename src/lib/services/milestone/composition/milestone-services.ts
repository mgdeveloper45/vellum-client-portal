import { CreateMilestoneService } from "../create-milestone-service";
import { CycleMilestoneStatusService } from "../cycle-milestone-status-service";
import { DeleteMilestoneService } from "../delete-milestone-service";
import { prismaMilestoneRepository } from "../prisma-milestone-repository";

export const createMilestoneService = new CreateMilestoneService(
  prismaMilestoneRepository,
);

export const cycleMilestoneStatusService = new CycleMilestoneStatusService(
  prismaMilestoneRepository,
);

export const deleteMilestoneService = new DeleteMilestoneService(
  prismaMilestoneRepository,
);
