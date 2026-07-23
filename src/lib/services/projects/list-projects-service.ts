import type {
  ProjectListRecord,
  ProjectRepository,
} from "./project-repository";

export interface ListProjectsRequest {
  workspaceId: string;
  viewerUserId: string;
  canManageProjects: boolean;
}

export type ListProjectsResult =
  | {
      success: true;
      projects: ProjectListRecord[];
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_VIEWER";
      message: string;
    };

export function createListProjectsService(
  projectRepository: ProjectRepository,
) {
  return async function listProjects(
    request: ListProjectsRequest,
  ): Promise<ListProjectsResult> {
    const workspaceId = request.workspaceId.trim();
    const viewerUserId = request.viewerUserId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    if (!viewerUserId) {
      return {
        success: false,
        reason: "INVALID_VIEWER",
        message: "A valid viewer is required.",
      };
    }

    const projects = await projectRepository.findMany({
      workspaceId,
      clientId: request.canManageProjects ? undefined : viewerUserId,
    });

    return {
      success: true,
      projects,
    };
  };
}
