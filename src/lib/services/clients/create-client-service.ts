import type { ClientRepository } from "./client-repository";

export interface CreateClientRequest {
  workspaceId: string;
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
  passwordHash: string;
}

export type CreateClientResult =
  | {
      success: true;
      clientId: string;
    }
  | {
      success: false;
      reason:
        "INVALID_WORKSPACE" | "INVALID_PASSWORD_HASH" | "EMAIL_ALREADY_EXISTS";
      message: string;
    };

export interface CreateClientServiceDependencies {
  clientRepository: ClientRepository;
}

export function createCreateClientService({
  clientRepository,
}: CreateClientServiceDependencies) {
  return async function createClient(
    request: CreateClientRequest,
  ): Promise<CreateClientResult> {
    const workspaceId = request.workspaceId.trim();
    const passwordHash = request.passwordHash.trim();
    const email = request.email.trim().toLowerCase();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
      };
    }

    if (!passwordHash) {
      return {
        success: false,
        reason: "INVALID_PASSWORD_HASH",
        message: "A password hash is required.",
      };
    }

    const existingUser = await clientRepository.findByEmail({
      email,
    });

    if (existingUser) {
      return {
        success: false,
        reason: "EMAIL_ALREADY_EXISTS",
        message: "A user with this email already exists.",
      };
    }

    const client = await clientRepository.create({
      workspaceId,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      email,
      notes: request.notes.trim(),
      password: passwordHash,
    });

    return {
      success: true,
      clientId: client.id,
    };
  };
}

export type CreateClientService = ReturnType<typeof createCreateClientService>;
