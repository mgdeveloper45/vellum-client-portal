import type { ProjectRepository, ProjectStatus } from "./project-repository";

export interface UpdateProjectRequest {
  workspaceId: string;
  projectId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  clientId: string;
}

export type UpdateProjectResult =
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
      reason:
        | "INVALID_WORKSPACE"
        | "INVALID_CLIENT"
        | "INVALID_OWNER"
        | "PROJECT_NOT_FOUND";
      message: string;
    };

export function createUpdateProjectService(
  projectRepository: ProjectRepository,
) {
  return async function updateProject(
    request: UpdateProjectRequest,
  ): Promise<UpdateProjectResult> {
    const workspaceId = request.workspaceId.trim();
    const projectId = request.projectId.trim();
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

    const project = await projectRepository.update({
      workspaceId,
      projectId,
      name: request.name.trim(),
      description: request.description.trim(),
      status: request.status,
      ownerId,
      clientId,
    });

    if (!project) {
      return {
        success: false,
        reason: "PROJECT_NOT_FOUND",
        message: "The project does not exist in this workspace.",
      };
    }

    return {
      success: true,
      project,
    };
  };
}
