import crypto from "crypto";
import type {
  WorkspaceInvitationRepository,
  WorkspaceInvitationRole,
} from "./workspace-invitation-repository";

const INVITATION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 7;

export type CreateWorkspaceInvitationInput = {
  invitedById: string;
  email: string;
  role: WorkspaceInvitationRole;
};

export type CreateWorkspaceInvitationResult =
  | {
      status: "invalid_email";
    }
  | {
      status: "invalid_role";
    }
  | {
      status: "inviter_not_found";
    }
  | {
      status: "workspace_not_found";
    }
  | {
      status: "created";
      invitation: {
        email: string;
        token: string;
        workspaceName: string;
      };
    };

type CreateWorkspaceInvitationServiceDependencies = {
  workspaceInvitationRepository: WorkspaceInvitationRepository;
  generateToken?: () => string;
  now?: () => Date;
};

export function createCreateWorkspaceInvitationService(
  dependencies: CreateWorkspaceInvitationServiceDependencies,
) {
  const generateToken =
    dependencies.generateToken ??
    (() => crypto.randomBytes(32).toString("hex"));

  const now = dependencies.now ?? (() => new Date());

  return async function createWorkspaceInvitation(
    input: CreateWorkspaceInvitationInput,
  ): Promise<CreateWorkspaceInvitationResult> {
    const email = input.email.trim();

    if (!email) {
      return {
        status: "invalid_email",
      };
    }

    if (input.role !== "ADMIN" && input.role !== "CLIENT") {
      return {
        status: "invalid_role",
      };
    }

    const createdAt = now();
    const expiresAt = new Date(createdAt.getTime() + INVITATION_LIFETIME_MS);

    const result =
      await dependencies.workspaceInvitationRepository.createInvitation({
        invitedById: input.invitedById,
        email,
        role: input.role,
        token: generateToken(),
        expiresAt,
      });

    if (result.status !== "created") {
      return result;
    }

    return {
      status: "created",
      invitation: {
        email: result.invitation.email,
        token: result.invitation.token,
        workspaceName: result.invitation.workspaceName,
      },
    };
  };
}
