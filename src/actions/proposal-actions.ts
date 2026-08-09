"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProposals } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createProposalService,
  deleteProposalService,
  generateProposalService,
  toggleProposalApprovalService,
} from "@/lib/services/proposal/composition/proposal-services";
import {
  createProposalSchema,
  proposalMutationSchema,
} from "@/lib/validation/proposal";
import { redirect } from "next/navigation";
import { 
  getProjectAiContextService, 
} from "@/lib/services/projects/composition/project-services";

export interface GenerateProposalDraftInput {
  projectId: string;
  projectDescription: string;
  estimatedPrice: number;
  estimatedTimeline: string;
}

export type GenerateProposalDraftResult =
  | {
      success: true;
      title: string;
      content: string;
    }
  | {
      success: false;
      error: string;
    };

export interface SaveProposalDraftInput {
  projectId: string;
  title: string;
  content: string;
}

export type SaveProposalDraftResult =
  | {
      success: true;
      proposalId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function generateProposalDraftAction(
  input: GenerateProposalDraftInput,
): Promise<GenerateProposalDraftResult> {
  const session = await auth();

  if (!session?.user || !canManageProposals(session.user.role)) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const workspace =
  await prismaUserWorkspaceRepository.findWorkspaceBusinessContextByUserId(
    session.user.id,
  );

if (!workspace) {
  return {
    success: false,
    error: "Workspace not found.",
  };
}

const workspaceId = workspace.id;

  const project = await getProjectAiContextService.execute({
    workspaceId,
    projectId: input.projectId,
  });

  if (!project) {
    return {
      success: false,
      error: "Project not found.",
    };
  }

  try {
    const content = await generateProposalService.generate({
      clientName: `${project.client.firstName} ${project.client.lastName}`,
      businessName: workspace.companyName ?? workspace.name,
      projectName: project.name,
      projectDescription: input.projectDescription,
      estimatedPrice: input.estimatedPrice,
      estimatedTimeline: input.estimatedTimeline,
    });

    return {
      success: true,
      title: `${project.name} Proposal`,
      content,
    };
  } catch {
    return {
      success: false,
      error: "Unable to generate proposal.",
    };
  }
}

export async function createProposalAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProposals(session.user.role)) {
    return;
  }

  const input = createProposalSchema.parse({
    projectId: formData.get("projectId"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await createProposalService.execute({
    projectId: input.projectId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "PROPOSAL_CREATED",
    entity: "PROPOSAL",
    entityId: result.proposal.id,
    userId: session.user.id,
    metadata: {
      projectId: result.proposal.projectId,
      approved: result.proposal.approved,
    },
  });

  redirect(`/projects/${result.proposal.projectId}`);
}

export async function saveProposalDraftAction(
  input: SaveProposalDraftInput,
): Promise<SaveProposalDraftResult> {
  const session = await auth();

  if (!session?.user || !canManageProposals(session.user.role)) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return {
      success: false,
      error: "Workspace not found.",
    };
  }

  const title = input.title.trim();
  const content = input.content.trim();

  if (!title) {
    return {
      success: false,
      error: "Proposal title is required.",
    };
  }

  if (!content) {
    return {
      success: false,
      error: "Proposal content is required.",
    };
  }

  const result = await createProposalService.execute({
    projectId: input.projectId,
    workspaceId,
    title,
    content,
  });

  if (!result.success) {
    return {
      success: false,
      error: "Project not found.",
    };
  }

  await createAuditLog({
    action: "PROPOSAL_CREATED",
    entity: "PROPOSAL",
    entityId: result.proposal.id,
    userId: session.user.id,
    metadata: {
      projectId: result.proposal.projectId,
      approved: result.proposal.approved,
      source: "AI_DRAFT",
    },
  });

  return {
    success: true,
    proposalId: result.proposal.id,
  };
}

export async function toggleProposalApprovalAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProposals(session.user.role)) {
    return;
  }

  const input = proposalMutationSchema.parse({
    proposalId: formData.get("proposalId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await toggleProposalApprovalService.execute({
    proposalId: input.proposalId,
    projectId: input.projectId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: result.proposal.approved
      ? "PROPOSAL_APPROVED"
      : "PROPOSAL_REJECTED",
    entity: "PROPOSAL",
    entityId: result.proposal.id,
    userId: session.user.id,
    metadata: {
      projectId: result.proposal.projectId,
      approved: result.proposal.approved,
    },
  });

  redirect(`/projects/${result.proposal.projectId}`);
}

export async function deleteProposalAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProposals(session.user.role)) {
    return;
  }

  const input = proposalMutationSchema.parse({
    proposalId: formData.get("proposalId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await deleteProposalService.execute({
    proposalId: input.proposalId,
    projectId: input.projectId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "PROPOSAL_DELETED",
    entity: "PROPOSAL",
    entityId: result.proposal.id,
    userId: session.user.id,
    metadata: {
      projectId: result.proposal.projectId,
      approved: result.proposal.approved,
    },
  });

  redirect(`/projects/${result.proposal.projectId}`);
}
