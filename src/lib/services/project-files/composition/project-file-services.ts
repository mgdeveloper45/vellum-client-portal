import { prismaProjectFileRepository } from "../prisma-project-file-repository";
import { UploadProjectFileService } from "../upload-project-file-service";
import { DeleteProjectFileService } from "../delete-project-file-service";

export const uploadProjectFileService = new UploadProjectFileService(
  prismaProjectFileRepository,
);

export const deleteProjectFileService = new DeleteProjectFileService(
  prismaProjectFileRepository,
);
