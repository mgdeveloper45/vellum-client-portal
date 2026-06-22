"use server";

import { auth } from "@/auth";
import { canManageProposals } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProposalAction(formData: FormData) {
  const session = await auth();

  if (!canManageProposals(session?.user?.role)) {
    return;
  }

  const projectId = String(formData.get("projectId"));

  const proposal = await prisma.proposal.create({
    data: {
      projectId,
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

  redirect(`/projects/${projectId}`);
}

export async function toggleProposalApprovalAction(formData: FormData) {
  const session = await auth();

  if (!canManageProposals(session?.user?.role)) {
    return;
  }

  const proposalId = String(formData.get("proposalId"));

  const projectId = String(formData.get("projectId"));

  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId,
    },
  });

  if (!proposal) {
    return;
  }

  const updatedProposal = await prisma.proposal.update({
    where: {
      id: proposalId,
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

  redirect(`/projects/${projectId}`);
}

export async function deleteProposalAction(formData: FormData) {
  const session = await auth();

  if (!canManageProposals(session?.user?.role)) {
    return;
  }

  const proposalId = String(formData.get("proposalId"));

  const projectId = String(formData.get("projectId"));

  await prisma.proposal.delete({
    where: {
      id: proposalId,
    },
  });

  redirect(`/projects/${projectId}`);
}
