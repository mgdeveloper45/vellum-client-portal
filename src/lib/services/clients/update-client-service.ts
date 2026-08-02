import type { ClientRepository, ClientStatus } from "./client-repository";

export interface UpdateClientRequest {
  workspaceId: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
  clientStatus: ClientStatus;
  isBlacklisted: boolean;
}

export type UpdateClientResult =
  | {
      success: true;
      clientId: string;
    }
  | {
      success: false;
      reason:
        | "INVALID_WORKSPACE"
        | "INVALID_CLIENT"
        | "EMAIL_ALREADY_EXISTS"
        | "CLIENT_NOT_FOUND";
      message: string;
    };

export interface UpdateClientServiceDependencies {
  clientRepository: ClientRepository;
}

export function createUpdateClientService({
  clientRepository,
}: UpdateClientServiceDependencies) {
  return async function updateClient(
    request: UpdateClientRequest,
  ): Promise<UpdateClientResult> {
    const workspaceId = request.workspaceId.trim();
    const clientId = request.clientId.trim();
    const email = request.email.trim().toLowerCase();

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

    const existingUser = await clientRepository.findByEmail({
      email,
      excludeClientId: clientId,
    });

    if (existingUser) {
      return {
        success: false,
        reason: "EMAIL_ALREADY_EXISTS",
        message: "A user with this email already exists.",
      };
    }

    const updated = await clientRepository.update({
      workspaceId,
      clientId,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      email,
      notes: request.notes.trim(),
      clientStatus: request.clientStatus,
      isBlacklisted: request.isBlacklisted,
    });

    if (!updated) {
      return {
        success: false,
        reason: "CLIENT_NOT_FOUND",
        message: "The client does not exist in this workspace.",
      };
    }

    return {
      success: true,
      clientId,
    };
  };
}

export type UpdateClientService = ReturnType<typeof createUpdateClientService>;
