import type {
  ProjectEditRecord,
  ProjectPersonRecord,
  ProjectRepository,
} from "./project-repository";

export interface GetProjectForEditRequest {
  workspaceId: string;
  projectId: string;
}

export type GetProjectForEditResult =
  | {
      success: true;
      project: ProjectEditRecord;
    }
  | {
      success: false;
      reason: "PROJECT_NOT_FOUND";
      message: string;
    };

export type ListProjectClientsResult =
  | {
      success: true;
      clients: ProjectPersonRecord[];
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE";
      message: string;
    };

export function createGetProjectForEditService(
  projectRepository: ProjectRepository,
) {
  return async function getProjectForEdit(
    request: GetProjectForEditRequest,
  ): Promise<GetProjectForEditResult> {
    const project = await projectRepository.findForEdit({
      workspaceId: request.workspaceId.trim(),
      projectId: request.projectId.trim(),
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

export function createListProjectClientsService(
  projectRepository: ProjectRepository,
) {
  return async function listProjectClients(
    workspaceIdValue: string,
  ): Promise<ListProjectClientsResult> {
    const workspaceId = workspaceIdValue.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    const clients = await projectRepository.findWorkspaceClients(workspaceId);

    return {
      success: true,
      clients,
    };
  };
}
