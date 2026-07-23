import type {
  ClientDetailRecord,
  ClientEditRecord,
  ClientRepository,
} from "./client-repository";

interface GetClientBaseRequest {
  workspaceId: string;
  clientId: string;
  viewerUserId: string;
  canManageClients: boolean;
}

export type GetClientDetailRequest = GetClientBaseRequest;

export interface GetClientForEditRequest {
  workspaceId: string;
  clientId: string;
}

export type GetClientDetailResult =
  | {
      success: true;
      client: ClientDetailRecord;
    }
  | {
      success: false;
      reason:
        | "INVALID_WORKSPACE"
        | "INVALID_CLIENT"
        | "FORBIDDEN"
        | "CLIENT_NOT_FOUND";
      message: string;
    };

export type GetClientForEditResult =
  | {
      success: true;
      client: ClientEditRecord;
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "INVALID_CLIENT" | "CLIENT_NOT_FOUND";
      message: string;
    };

export interface GetClientServiceDependencies {
  clientRepository: ClientRepository;
}

export function createGetClientDetailService({
  clientRepository,
}: GetClientServiceDependencies) {
  return async function getClientDetail(
    request: GetClientDetailRequest,
  ): Promise<GetClientDetailResult> {
    const workspaceId = request.workspaceId.trim();
    const clientId = request.clientId.trim();
    const viewerUserId = request.viewerUserId.trim();

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

    if (!request.canManageClients && clientId !== viewerUserId) {
      return {
        success: false,
        reason: "FORBIDDEN",
        message: "You do not have permission to view this client.",
      };
    }

    const client = await clientRepository.findDetail({
      workspaceId,
      clientId,
    });

    if (!client) {
      return {
        success: false,
        reason: "CLIENT_NOT_FOUND",
        message: "The client does not exist in this workspace.",
      };
    }

    return {
      success: true,
      client,
    };
  };
}

export function createGetClientForEditService({
  clientRepository,
}: GetClientServiceDependencies) {
  return async function getClientForEdit(
    request: GetClientForEditRequest,
  ): Promise<GetClientForEditResult> {
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

    const client = await clientRepository.findForEdit({
      workspaceId,
      clientId,
    });

    if (!client) {
      return {
        success: false,
        reason: "CLIENT_NOT_FOUND",
        message: "The client does not exist in this workspace.",
      };
    }

    return {
      success: true,
      client,
    };
  };
}
