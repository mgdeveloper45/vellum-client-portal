import { getR2DownloadUrl } from "@/lib/r2";

import { createCreateProjectService } from "../create-project-service";
import { createDeleteProjectService } from "../delete-project-service";
import {
  createGetProjectForEditService,
  createListProjectClientsService,
} from "../get-project-service";
import { createListProjectsService } from "../list-projects-service";
import { prismaProjectRepository } from "../prisma-project-repository";
import { createProjectDetailBuilder } from "../project-detail-builder";
import { createUpdateProjectService } from "../update-project-service";

export const createProjectService = createCreateProjectService(
  prismaProjectRepository,
);

export const updateProjectService = createUpdateProjectService(
  prismaProjectRepository,
);

export const deleteProjectService = createDeleteProjectService(
  prismaProjectRepository,
);

export const listProjectsService = createListProjectsService(
  prismaProjectRepository,
);

export const getProjectForEditService = createGetProjectForEditService(
  prismaProjectRepository,
);

export const listProjectClientsService = createListProjectClientsService(
  prismaProjectRepository,
);

export const buildProjectDetail = createProjectDetailBuilder({
  projectRepository: prismaProjectRepository,
  getDownloadUrl: getR2DownloadUrl,
});
