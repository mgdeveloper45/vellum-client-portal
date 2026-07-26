import { prismaWorkspaceSearchRepository } from "../prisma-workspace-search-repository";
import { WorkspaceSearchService } from "../workspace-search-service";

export const workspaceSearchService = new WorkspaceSearchService(
  prismaWorkspaceSearchRepository,
);
