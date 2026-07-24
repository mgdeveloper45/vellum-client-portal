"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProposals } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createProposalService,
  deleteProposalService,
  toggleProposalApprovalService,
} from "@/lib/services/proposal/composition/proposal-services";
import {
  createProposalSchema,
  proposalMutationSchema,
} from "@/lib/validation/proposal";
import { redirect } from "next/navigation";

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
