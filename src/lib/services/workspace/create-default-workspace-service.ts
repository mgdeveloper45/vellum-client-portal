import type { WorkspaceSetupRepository } from "./workspace-setup-repository";

export interface CreateDefaultWorkspaceRequest {
  userId: string;
  workspaceName?: string;
}

export type CreateDefaultWorkspaceResult =
  | {
      success: true;
      workspace: {
        id: string;
        name: string;
        slug: string;
      };
      migratedProjectCount: number;
      migratedClientCount: number;
    }
  | {
      success: false;
      code: "USER_NOT_FOUND" | "ALREADY_ASSIGNED" | "ASSIGNMENT_CONFLICT";
      workspaceId?: string;
    };

export interface CreateDefaultWorkspaceServiceDependencies {
  workspaceSetupRepository: WorkspaceSetupRepository;
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createCreateDefaultWorkspaceService(
  dependencies: CreateDefaultWorkspaceServiceDependencies,
) {
  return {
    async execute(
      request: CreateDefaultWorkspaceRequest,
    ): Promise<CreateDefaultWorkspaceResult> {
      const workspaceName = request.workspaceName?.trim() || "Vellum Workspace";
      const workspaceSlug = createSlug(workspaceName);

      if (!workspaceSlug) {
        throw new Error(
          "A workspace slug could not be generated from the workspace name.",
        );
      }

      const result =
        await dependencies.workspaceSetupRepository.createDefaultWorkspace({
          userId: request.userId,
          workspaceName,
          workspaceSlug,
        });

      switch (result.status) {
        case "created":
          return {
            success: true,
            workspace: {
              id: result.workspace.id,
              name: result.workspace.name,
              slug: result.workspace.slug,
            },
            migratedProjectCount: result.workspace.migratedProjectCount,
            migratedClientCount: result.workspace.migratedClientCount,
          };

        case "user_not_found":
          return {
            success: false,
            code: "USER_NOT_FOUND",
          };

        case "already_assigned":
          return {
            success: false,
            code: "ALREADY_ASSIGNED",
            workspaceId: result.workspaceId,
          };

        case "assignment_conflict":
          return {
            success: false,
            code: "ASSIGNMENT_CONFLICT",
          };
      }
    },
  };
}
