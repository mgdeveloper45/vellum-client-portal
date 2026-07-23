import type {
  ClientRepository,
  ClientSummaryRecord,
} from "./client-repository";

export interface ListClientsRequest {
  workspaceId: string;
  viewerUserId: string;
  canManageClients: boolean;
}

export type ListClientsResult =
  | {
      success: true;
      clients: ClientSummaryRecord[];
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_VIEWER";
      message: string;
    };

export interface ListClientsServiceDependencies {
  clientRepository: ClientRepository;
}

export function createListClientsService({
  clientRepository,
}: ListClientsServiceDependencies) {
  return async function listClients(
    request: ListClientsRequest,
  ): Promise<ListClientsResult> {
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

    const clients = await clientRepository.findMany({
      workspaceId,
      clientId: request.canManageClients ? undefined : viewerUserId,
    });

    return {
      success: true,
      clients,
    };
  };
}

export type ListClientsService = ReturnType<typeof createListClientsService>;
