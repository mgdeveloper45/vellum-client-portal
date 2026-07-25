export interface ProjectFileRecord {
  id: string;
  name: string;
  url: string;
  fileType: string;
  projectId: string;
}

export interface CreateProjectFileInput {
  projectId: string;
  name: string;
  url: string;
  fileType: string;
}

export interface FindProjectInput {
  workspaceId: string;
  projectId: string;
}

export interface FindProjectFileInput {
  workspaceId: string;
  projectId: string;
  fileId: string;
}

export interface ProjectFileRepository {
  findProject(
    input: FindProjectInput,
  ): Promise<{ id: string } | null>;

  create(
    input: CreateProjectFileInput,
  ): Promise<ProjectFileRecord>;

  findFile(
    input: FindProjectFileInput,
  ): Promise<ProjectFileRecord | null>;

  delete(
    fileId: string,
  ): Promise<void>;
}