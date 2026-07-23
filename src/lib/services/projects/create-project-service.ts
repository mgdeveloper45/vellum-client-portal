import type { ProjectRepository, ProjectStatus } from "./project-repository";

export interface CreateProjectRequest {
  workspaceId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  clientId: string;
}

export type CreateProjectResult =
  | {
      success: true;
      project: {
        id: string;
        name: string;
        status: ProjectStatus;
        clientId: string;
      };
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_CLIENT" | "INVALID_OWNER";
      message: string;
    };

export function createCreateProjectService(
  projectRepository: ProjectRepository,
) {
  return async function createProject(
    request: CreateProjectRequest,
  ): Promise<CreateProjectResult> {
    const workspaceId = request.workspaceId.trim();
    const clientId = request.clientId.trim();
    const ownerId = request.ownerId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    const [clientIsValid, ownerIsValid] = await Promise.all([
      projectRepository.isWorkspaceClient(workspaceId, clientId),
      projectRepository.isWorkspaceProjectOwner(workspaceId, ownerId),
    ]);

    if (!clientIsValid) {
      return {
        success: false,
        reason: "INVALID_CLIENT",
        message: "The selected client does not belong to this workspace.",
      };
    }

    if (!ownerIsValid) {
      return {
        success: false,
        reason: "INVALID_OWNER",
        message:
          "The selected project owner is not an eligible workspace member.",
      };
    }

    const project = await projectRepository.create({
      workspaceId,
      name: request.name.trim(),
      description: request.description.trim(),
      status: request.status,
      ownerId,
      clientId,
    });

    return {
      success: true,
      project,
    };
  };
}
