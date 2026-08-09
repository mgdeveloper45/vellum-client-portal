import { prisma } from "@/lib/prisma";

import type {
  CreateProposalRecordInput,
  ProposalListRecord,
  ProposalMutationRecord,
  ProposalRepository,
} from "./proposal-repository";

export class PrismaProposalRepository
  implements ProposalRepository
{
  async projectExistsInWorkspace(input: {
    projectId: string;
    workspaceId: string;
  }): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
      },
    });

    return Boolean(project);
  }

  async createProposal(
    input: CreateProposalRecordInput,
  ): Promise<ProposalMutationRecord> {
    return prisma.proposal.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        content: input.content,
        approved: false,
      },
      select: {
        id: true,
        projectId: true,
        approved: true,
      },
    });
  }

  async findProposalForMutation(input: {
    proposalId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<ProposalMutationRecord | null> {
    return prisma.proposal.findFirst({
      where: {
        id: input.proposalId,
        projectId: input.projectId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        projectId: true,
        approved: true,
      },
    });
  }

  async updateProposalApproval(input: {
    proposalId: string;
    approved: boolean;
  }): Promise<ProposalMutationRecord> {
    return prisma.proposal.update({
      where: {
        id: input.proposalId,
      },
      data: {
        approved: input.approved,
      },
      select: {
        id: true,
        projectId: true,
        approved: true,
      },
    });
  }

  async deleteProposal(
    proposalId: string,
  ): Promise<void> {
    await prisma.proposal.delete({
      where: {
        id: proposalId,
      },
    });
  }

  async findProposals(input: {
    workspaceId: string;
    clientId?: string;
  }): Promise<ProposalListRecord[]> {
    return prisma.proposal.findMany({
      where: {
        project: {
          workspaceId: input.workspaceId,
          ...(input.clientId
            ? {
                clientId: input.clientId,
              }
            : {}),
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        approved: true,
        createdAt: true,
        updatedAt: true,

        project: {
          select: {
            id: true,
            name: true,

            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const prismaProposalRepository =
  new PrismaProposalRepository();