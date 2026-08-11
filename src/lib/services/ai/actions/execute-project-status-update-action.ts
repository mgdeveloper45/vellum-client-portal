import {
  getProjectForEditService,
  listProjectsService,
  updateProjectService,
} from "@/lib/services/projects/composition/project-services";
import type { ProjectStatus } from "@/lib/services/projects/project-repository";

export type ExecuteProjectStatusUpdateResult =
  | {
      success: true;
      message: string;
      metadata: {
        projectId: string;
        status: ProjectStatus;
      };
    }
  | {
      success: false;
      message: string;
    };

const STATUS_PATTERNS: Array<{
  status: ProjectStatus;
  patterns: RegExp[];
}> = [
  {
    status: "COMPLETED",
    patterns: [/\bcompleted?\b/i, /\bfinished?\b/i, /\bdone\b/i],
  },
  {
    status: "REVIEW",
    patterns: [/\breview\b/i, /\bin review\b/i],
  },
  {
    status: "ACTIVE",
    patterns: [/\bactive\b/i, /\bin progress\b/i],
  },
  {
    status: "PLANNING",
    patterns: [/\bplanning\b/i, /\bplanned\b/i],
  },
];

function resolveRequestedStatus(command: string): ProjectStatus | null {
  for (const candidate of STATUS_PATTERNS) {
    if (candidate.patterns.some((pattern) => pattern.test(command))) {
      return candidate.status;
    }
  }

  return null;
}

export async function executeProjectStatusUpdateAction(input: {
  workspaceId: string;
  userId: string;
  command: string;
}): Promise<ExecuteProjectStatusUpdateResult> {
  const requestedStatus = resolveRequestedStatus(input.command);

  if (!requestedStatus) {
    return {
      success: false,
      message: "I need more information before updating the project: status.",
    };
  }

  const projectsResult = await listProjectsService({
    workspaceId: input.workspaceId,
    viewerUserId: input.userId,
    canManageProjects: true,
  });

  if (!projectsResult.success) {
    return {
      success: false,
      message: projectsResult.message,
    };
  }

  const normalizedCommand = input.command.toLowerCase();

  const matchingProjects = projectsResult.projects.filter((project) =>
    normalizedCommand.includes(project.name.toLowerCase()),
  );

  if (matchingProjects.length === 0) {
    return {
      success: false,
      message: "I couldn't determine which project you want to update.",
    };
  }

  if (matchingProjects.length > 1) {
    return {
      success: false,
      message:
        "Multiple projects matched that command. Please specify the project more precisely.",
    };
  }

  const matchedProject = matchingProjects[0];

  const projectResult = await getProjectForEditService({
    workspaceId: input.workspaceId,
    projectId: matchedProject.id,
  });

  if (!projectResult.success) {
    return {
      success: false,
      message: projectResult.message,
    };
  }

  const project = projectResult.project;

  if (project.status === requestedStatus) {
    return {
      success: true,
      message: `${project.name} is already ${requestedStatus}.`,
      metadata: {
        projectId: project.id,
        status: requestedStatus,
      },
    };
  }

  const updateResult = await updateProjectService({
    workspaceId: input.workspaceId,
    projectId: project.id,
    name: project.name,
    description: project.description,
    status: requestedStatus,
    ownerId: project.ownerId,
    clientId: project.clientId,
  });

  if (!updateResult.success) {
    return {
      success: false,
      message: updateResult.message,
    };
  }

  return {
    success: true,
    message: `${updateResult.project.name} was updated to ${updateResult.project.status}.`,
    metadata: {
      projectId: updateResult.project.id,
      status: updateResult.project.status,
    },
  };
}
