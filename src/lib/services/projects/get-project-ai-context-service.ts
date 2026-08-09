import type {
  ProjectDetailRecord,
  ProjectRepository,
} from "./project-repository";

export interface GetProjectAiContextInput {
  workspaceId: string;
  projectId: string;
}

export function createGetProjectAiContextService(
  repository: ProjectRepository,
) {
  return {
    async execute({
      workspaceId,
      projectId,
    }: GetProjectAiContextInput): Promise<ProjectDetailRecord | null> {
      return repository.findDetail({
        workspaceId,
        projectId,
      });
    },
  };
}
