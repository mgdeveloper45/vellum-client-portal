import { uploadFileToR2, deleteFileFromR2 } from "@/lib/r2";

import {
  MAX_PROJECT_FILE_SIZE,
  ALLOWED_PROJECT_FILE_TYPES,
  validateUploadedFile,
} from "@/lib/files/file-validation";

import type {
  ProjectFileRecord,
  ProjectFileRepository,
} from "./project-file-repository";

export interface UploadProjectFileInput {
  workspaceId: string;
  projectId: string;
  file: File;
}

export class UploadProjectFileService {
  constructor(private readonly repository: ProjectFileRepository) {}

  async execute(input: UploadProjectFileInput): Promise<ProjectFileRecord> {
    const project = await this.repository.findProject({
      workspaceId: input.workspaceId,
      projectId: input.projectId,
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const validation = validateUploadedFile(input.file, {
      maxSize: MAX_PROJECT_FILE_SIZE,
      allowedTypes: ALLOWED_PROJECT_FILE_TYPES,
    });

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const key = await uploadFileToR2({
      file: input.file,
      folder: `projects/${project.id}`,
    });

    try {
      return await this.repository.create({
        projectId: project.id,
        name: input.file.name,
        url: key,
        fileType: input.file.type || "Unknown",
      });
    } catch (error) {
      await deleteFileFromR2(key).catch(() => undefined);
      throw error;
    }
  }
}
