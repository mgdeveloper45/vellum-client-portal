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

function detailFailure(
  reason: Exclude<GetClientDetailResult, { success: true }>["reason"],
  message: string,
): GetClientDetailResult {
  return {
    success: false,
    reason,
    message,
  };
}

function editFailure(
  reason: Exclude<GetClientForEditResult, { success: true }>["reason"],
  message: string,
): GetClientForEditResult {
  return {
    success: false,
    reason,
    message,
  };
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
      return detailFailure(
        "INVALID_WORKSPACE",
        "A valid workspace is required.",
      );
    }

    if (!clientId) {
      return detailFailure("INVALID_CLIENT", "A valid client is required.");
    }

    if (!request.canManageClients && clientId !== viewerUserId) {
      return detailFailure(
        "FORBIDDEN",
        "You do not have permission to view this client.",
      );
    }

    const client = await clientRepository.findDetail({
      workspaceId,
      clientId,
    });

    if (!client) {
      return detailFailure(
        "CLIENT_NOT_FOUND",
        "The client does not exist in this workspace.",
      );
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
      return editFailure("INVALID_WORKSPACE", "A valid workspace is required.");
    }

    if (!clientId) {
      return editFailure("INVALID_CLIENT", "A valid client is required.");
    }

    const client = await clientRepository.findForEdit({
      workspaceId,
      clientId,
    });

    if (!client) {
      return editFailure(
        "CLIENT_NOT_FOUND",
        "The client does not exist in this workspace.",
      );
    }

    return {
      success: true,
      client,
    };
  };
}
