import { prisma } from "@/lib/prisma";

import type {
  CreateProjectFileInput,
  FindProjectFileInput,
  FindProjectInput,
  ProjectFileRecord,
  ProjectFileRepository,
} from "./project-file-repository";

export const prismaProjectFileRepository: ProjectFileRepository = {
  async findProject(input: FindProjectInput): Promise<{ id: string } | null> {
    return prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
      },
    });
  },

  async create(input: CreateProjectFileInput): Promise<ProjectFileRecord> {
    return prisma.projectFile.create({
      data: {
        projectId: input.projectId,
        name: input.name,
        url: input.url,
        fileType: input.fileType,
      },
      select: {
        id: true,
        name: true,
        url: true,
        fileType: true,
        projectId: true,
      },
    });
  },

  async findFile(
    input: FindProjectFileInput,
  ): Promise<ProjectFileRecord | null> {
    return prisma.projectFile.findFirst({
      where: {
        id: input.fileId,
        projectId: input.projectId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        name: true,
        url: true,
        fileType: true,
        projectId: true,
      },
    });
  },

  async delete(fileId: string): Promise<void> {
    await prisma.projectFile.delete({
      where: {
        id: fileId,
      },
    });
  },
};
