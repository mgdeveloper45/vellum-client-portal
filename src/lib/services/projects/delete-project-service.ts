import type { ProjectRepository, ProjectStatus } from "./project-repository";

export interface DeleteProjectRequest {
  workspaceId: string;
  projectId: string;
}

export type DeleteProjectResult =
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
        "INVALID_WORKSPACE" | "PROJECT_NOT_FOUND" | "PROJECT_HAS_DEPENDENCIES";
      message: string;
    };

export function createDeleteProjectService(
  projectRepository: ProjectRepository,
) {
  return async function deleteProject(
    request: DeleteProjectRequest,
  ): Promise<DeleteProjectResult> {
    const workspaceId = request.workspaceId.trim();
    const projectId = request.projectId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    const dependencies = await projectRepository.findDependencies({
      workspaceId,
      projectId,
    });

    if (!dependencies) {
      return {
        success: false,
        reason: "PROJECT_NOT_FOUND",
        message: "The project does not exist in this workspace.",
      };
    }

    const dependencyCount =
      dependencies.files +
      dependencies.milestones +
      dependencies.messages +
      dependencies.invoices +
      dependencies.proposals;

    if (dependencyCount > 0) {
      return {
        success: false,
        reason: "PROJECT_HAS_DEPENDENCIES",
        message:
          "Projects containing files, milestones, messages, invoices, or proposals cannot be deleted.",
      };
    }

    const project = await projectRepository.delete({
      workspaceId,
      projectId,
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
