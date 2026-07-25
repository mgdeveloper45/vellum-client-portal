import { deleteFileFromR2 } from "@/lib/r2";

import type {
  ProjectFileRecord,
  ProjectFileRepository,
} from "./project-file-repository";

export interface DeleteProjectFileInput {
  workspaceId: string;
  projectId: string;
  fileId: string;
}

export class DeleteProjectFileService {
  constructor(private readonly repository: ProjectFileRepository) {}

  async execute(input: DeleteProjectFileInput): Promise<ProjectFileRecord> {
    const file = await this.repository.findFile({
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      fileId: input.fileId,
    });

    if (!file) {
      throw new Error("File not found.");
    }

    await this.repository.delete(file.id);

    await deleteFileFromR2(file.url).catch(() => undefined);

    return file;
  }
}
