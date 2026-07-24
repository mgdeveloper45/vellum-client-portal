import bcrypt from "bcryptjs";
import { createAcceptWorkspaceInvitationService } from "../accept-workspace-invitation-service";
import { createCreateWorkspaceInvitationService } from "../create-workspace-invitation-service";
import { prismaWorkspaceInvitationRepository } from "../prisma-workspace-invitation-repository";

export const createWorkspaceInvitationService =
  createCreateWorkspaceInvitationService({
    workspaceInvitationRepository: prismaWorkspaceInvitationRepository,
  });

export const acceptWorkspaceInvitationService =
  createAcceptWorkspaceInvitationService({
    workspaceInvitationRepository: prismaWorkspaceInvitationRepository,
    hashPassword: (password) => bcrypt.hash(password, 10),
  });
