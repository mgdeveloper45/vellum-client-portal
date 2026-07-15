"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProposals } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createProposalSchema,
  proposalMutationSchema,
} from "@/lib/validation/proposal";
import { redirect } from "next/navigation";

async function getWorkspaceId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
    },
  });

  return user?.workspaceId;
}

export async function createProposalAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProposals(session.user.role)) {
    return;
  }

  const input = createProposalSchema.parse({
    projectId: formData.get("projectId"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      workspaceId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return;
  }

  const proposal = await prisma.proposal.create({
    data: {
      projectId: project.id,
      approved: false,
    },
  });

  await createAuditLog({
    action: "PROPOSAL_CREATED",
    entity: "PROPOSAL",
    entityId: proposal.id,
    userId: session.user.id,
    metadata: {
      projectId: proposal.projectId,
      approved: proposal.approved,
    },
  });

  redirect(`/projects/${project.id}`);
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

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const proposal = await prisma.proposal.findFirst({
    where: {
      id: input.proposalId,
      projectId: input.projectId,
      project: {
        workspaceId,
      },
    },
  });

  if (!proposal) {
    return;
  }

  const updatedProposal = await prisma.proposal.update({
    where: {
      id: proposal.id,
    },
    data: {
      approved: !proposal.approved,
    },
  });

  await createAuditLog({
    action: updatedProposal.approved
      ? "PROPOSAL_APPROVED"
      : "PROPOSAL_REJECTED",
    entity: "PROPOSAL",
    entityId: updatedProposal.id,
    userId: session.user.id,
    metadata: {
      projectId: updatedProposal.projectId,
      approved: updatedProposal.approved,
    },
  });

  redirect(`/projects/${input.projectId}`);
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

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const proposal = await prisma.proposal.findFirst({
    where: {
      id: input.proposalId,
      projectId: input.projectId,
      project: {
        workspaceId,
      },
    },
    select: {
      id: true,
      approved: true,
    },
  });

  if (!proposal) {
    return;
  }

  await prisma.proposal.delete({
    where: {
      id: proposal.id,
    },
  });

  await createAuditLog({
    action: "PROPOSAL_DELETED",
    entity: "PROPOSAL",
    entityId: proposal.id,
    userId: session.user.id,
    metadata: {
      projectId: input.projectId,
      approved: proposal.approved,
    },
  });

  redirect(`/projects/${input.projectId}`);
}
