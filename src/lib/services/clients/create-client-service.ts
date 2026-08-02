import bcrypt from "bcryptjs";
import type { ClientRepository, ClientStatus } from "./client-repository";

export interface CreateClientRequest {
  workspaceId: string;
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
  clientStatus: ClientStatus;
}

export type CreateClientResult =
  | {
      success: true;
      clientId: string;
    }
  | {
      success: false;
      reason: "INVALID_WORKSPACE" | "EMAIL_ALREADY_EXISTS";
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
    const email = request.email.trim().toLowerCase();

    if (!workspaceId) {
      return {
        success: false,
        reason: "INVALID_WORKSPACE",
        message: "A valid workspace is required.",
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

    const passwordHash = await bcrypt.hash("password123", 10);

    const client = await clientRepository.create({
      workspaceId,
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      email,
      notes: request.notes.trim(),
      password: passwordHash,
      clientStatus: request.clientStatus,
    });

    return {
      success: true,
      clientId: client.id,
    };
  };
}

export type CreateClientService = ReturnType<typeof createCreateClientService>;
