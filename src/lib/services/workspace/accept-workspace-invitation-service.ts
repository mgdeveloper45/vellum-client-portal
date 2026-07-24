import type { WorkspaceInvitationRepository } from "./workspace-invitation-repository";

export type AcceptWorkspaceInvitationInput = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type AcceptWorkspaceInvitationResult =
  | {
      status: "invalid_input";
    }
  | {
      status: "invitation_not_found";
    }
  | {
      status: "already_accepted";
    }
  | {
      status: "expired";
    }
  | {
      status: "email_mismatch";
    }
  | {
      status: "accepted";
    };

type AcceptWorkspaceInvitationServiceDependencies = {
  workspaceInvitationRepository: WorkspaceInvitationRepository;
  hashPassword: (password: string) => Promise<string>;
  now?: () => Date;
};

export function createAcceptWorkspaceInvitationService(
  dependencies: AcceptWorkspaceInvitationServiceDependencies,
) {
  const now = dependencies.now ?? (() => new Date());

  return async function acceptWorkspaceInvitation(
    input: AcceptWorkspaceInvitationInput,
  ): Promise<AcceptWorkspaceInvitationResult> {
    const token = input.token.trim();
    const email = input.email.trim();
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();

    if (!token || !email || !firstName || !lastName || !input.password) {
      return {
        status: "invalid_input",
      };
    }

    const hashedPassword = await dependencies.hashPassword(input.password);

    return dependencies.workspaceInvitationRepository.acceptInvitation({
      token,
      email,
      firstName,
      lastName,
      hashedPassword,
      acceptedAt: now(),
    });
  };
}
