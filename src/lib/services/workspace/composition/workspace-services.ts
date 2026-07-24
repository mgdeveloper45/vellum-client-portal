import { createCreateDefaultWorkspaceService } from "../create-default-workspace-service";
import { prismaWorkspaceSetupRepository } from "../prisma-workspace-setup-repository";

export const createDefaultWorkspaceService =
  createCreateDefaultWorkspaceService({
    workspaceSetupRepository: prismaWorkspaceSetupRepository,
  });
