"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProposalAction(
  formData: FormData
) {
  const projectId = String(
    formData.get("projectId")
  );

  await prisma.proposal.create({
    data: {
      projectId,
      approved: false,
    },
  });

  redirect(`/projects/${projectId}`);
}

export async function toggleProposalApprovalAction(
  formData: FormData
) {
  const proposalId = String(
    formData.get("proposalId")
  );

  const projectId = String(
    formData.get("projectId")
  );

  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId,
    },
  });

  if (!proposal) {
    return;
  }

  await prisma.proposal.update({
    where: {
      id: proposalId,
    },
    data: {
      approved: !proposal.approved,
    },
  });

  redirect(`/projects/${projectId}`);
}

export async function deleteProposalAction(
  formData: FormData
) {
  const proposalId = String(
    formData.get("proposalId")
  );

  const projectId = String(
    formData.get("projectId")
  );

  await prisma.proposal.delete({
    where: {
      id: proposalId,
    },
  });

  redirect(`/projects/${projectId}`);
}