import { prisma } from "@/lib/prisma";
import type {
  AcceptWorkspaceInvitationRepositoryInput,
  AcceptWorkspaceInvitationRepositoryResult,
  CreateWorkspaceInvitationRepositoryResult,
  WorkspaceInvitationRepository,
  WorkspaceInvitationRole,
} from "./workspace-invitation-repository";

export class PrismaWorkspaceInvitationRepository implements WorkspaceInvitationRepository {
  async createInvitation(input: {
    invitedById: string;
    email: string;
    role: WorkspaceInvitationRole;
    token: string;
    expiresAt: Date;
  }): Promise<CreateWorkspaceInvitationRepositoryResult> {
    const inviter = await prisma.user.findUnique({
      where: {
        id: input.invitedById,
      },
      select: {
        workspaceId: true,
        workspace: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!inviter) {
      return {
        status: "inviter_not_found",
      };
    }

    if (!inviter.workspaceId) {
      return {
        status: "workspace_not_found",
      };
    }

    const invitation = await prisma.workspaceInvitation.create({
      data: {
        email: input.email,
        role: input.role,
        token: input.token,
        workspaceId: inviter.workspaceId,
        invitedById: input.invitedById,
        expiresAt: input.expiresAt,
      },
      select: {
        id: true,
        email: true,
        token: true,
      },
    });

    return {
      status: "created",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        token: invitation.token,
        workspaceName: inviter.workspace?.name ?? "Vellum Workspace",
      },
    };
  }

  async acceptInvitation(
    input: AcceptWorkspaceInvitationRepositoryInput,
  ): Promise<AcceptWorkspaceInvitationRepositoryResult> {
    return prisma.$transaction(async (transaction) => {
      const invitation = await transaction.workspaceInvitation.findUnique({
        where: {
          token: input.token,
        },
        select: {
          id: true,
          email: true,
          role: true,
          workspaceId: true,
          acceptedAt: true,
          expiresAt: true,
        },
      });

      if (!invitation) {
        return {
          status: "invitation_not_found",
        };
      }

      if (invitation.acceptedAt) {
        return {
          status: "already_accepted",
        };
      }

      if (invitation.expiresAt < input.acceptedAt) {
        return {
          status: "expired",
        };
      }

      if (invitation.email !== input.email) {
        return {
          status: "email_mismatch",
        };
      }

      const existingUser = await transaction.user.findUnique({
        where: {
          email: input.email,
        },
        select: {
          id: true,
        },
      });

      if (existingUser) {
        await transaction.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            role: invitation.role,
            isActive: true,
            workspaceId: invitation.workspaceId,
          },
        });
      } else {
        await transaction.user.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            password: input.hashedPassword,
            role: invitation.role,
            isActive: true,
            workspaceId: invitation.workspaceId,
          },
        });
      }

      const acceptedInvitation =
        await transaction.workspaceInvitation.updateMany({
          where: {
            id: invitation.id,
            acceptedAt: null,
          },
          data: {
            acceptedAt: input.acceptedAt,
          },
        });

      if (acceptedInvitation.count !== 1) {
        throw new Error(
          "Workspace invitation was accepted by another request.",
        );
      }

      return {
        status: "accepted",
      };
    });
  }
}

export const prismaWorkspaceInvitationRepository =
  new PrismaWorkspaceInvitationRepository();
