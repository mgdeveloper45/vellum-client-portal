import type { ClientRepository } from "./client-repository";

export interface DeleteClientRequest {
  workspaceId: string;
  clientId: string;
}

export type DeleteClientResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason:
        | "INVALID_WORKSPACE"
        | "INVALID_CLIENT"
        | "CLIENT_NOT_FOUND"
        | "CLIENT_HAS_PROJECTS";
      message: string;
    };

export interface DeleteClientServiceDependencies {
  clientRepository: ClientRepository;
}

export function createDeleteClientService({
  clientRepository,
}: DeleteClientServiceDependencies) {
  return async function deleteClient(
    request: DeleteClientRequest,
  ): Promise<DeleteClientResult> {
    const workspaceId = request.workspaceId.trim();
    const clientId = request.clientId.trim();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    if (!clientId) {
      return {
        success: false,
        reason: "INVALID_CLIENT",
        message: "A valid client is required.",
      };
    }

    const projectCount = await clientRepository.countProjects({
      workspaceId,
      clientId,
    });

    if (projectCount === null) {
      return {
        success: false,
        reason: "CLIENT_NOT_FOUND",
        message: "The client does not exist in this workspace.",
      };
    }

    if (projectCount > 0) {
      return {
        success: false,
        reason: "CLIENT_HAS_PROJECTS",
        message: "Clients with existing projects cannot be deleted.",
      };
    }

    const deleted = await clientRepository.delete({
      workspaceId,
      clientId,
    });

    if (!deleted) {
      return {
        success: false,
        reason: "CLIENT_NOT_FOUND",
        message: "The client does not exist in this workspace.",
      };
    }

    return {
      success: true,
    };
  };
}

export type DeleteClientService = ReturnType<typeof createDeleteClientService>;
