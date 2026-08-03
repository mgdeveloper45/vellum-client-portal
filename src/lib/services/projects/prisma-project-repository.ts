import { prisma } from "@/lib/prisma";

import type {
  CreateProjectRecordInput,
  FindProjectForViewerInput,
  FindProjectInput,
  FindProjectsInput,
  ProjectAuditRecord,
  ProjectDependencyCounts,
  ProjectDetailRecord,
  ProjectEditRecord,
  ProjectListRecord,
  ProjectPersonRecord,
  ProjectRepository,
  UpdateProjectRecordInput,
} from "./project-repository";

export const prismaProjectRepository: ProjectRepository = {
  async findMany(input: FindProjectsInput): Promise<ProjectListRecord[]> {
    return prisma.project.findMany({
      where: {
        workspaceId: input.workspaceId,
        ...(input.clientId
          ? {
              clientId: input.clientId,
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

 async findDetail(
  input: FindProjectForViewerInput,
): Promise<ProjectDetailRecord | null> {
  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      workspaceId: input.workspaceId,
      ...(input.clientId
        ? {
            clientId: input.clientId,
          }
        : {}),
    },
    include: {
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },

      milestones: {
        orderBy: {
          createdAt: "desc",
        },
      },

      invoices: {
        orderBy: {
          createdAt: "desc",
        },
      },

      deposits: {
        orderBy: {
          requestedAt: "desc",
        },
        select: {
          id: true,
          amount: true,
          status: true,
          projectId: true,
          dueDate: true,
          requestedAt: true,
          paidAt: true,
        },
      },

      proposals: {
        orderBy: {
          createdAt: "desc",
        },
      },

      files: {
        orderBy: {
          createdAt: "desc",
        },
      },

      messages: {
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    ...project,

    invoices: project.invoices.map((invoice) => ({
      id: invoice.id,
      amount: Number(invoice.amount),
      paid: invoice.paid,
      createdAt: invoice.createdAt,
    })),

    deposits: project.deposits.map((deposit) => ({
      id: deposit.id,
      amount: Number(deposit.amount),
      status: deposit.status,
      projectId: deposit.projectId,
      dueDate: deposit.dueDate,
      requestedAt: deposit.requestedAt,
      paidAt: deposit.paidAt,
    })),
  };
},

  async findForEdit(
    input: FindProjectInput,
  ): Promise<ProjectEditRecord | null> {
    return prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        clientId: true,
        ownerId: true,
      },
    });
  },

  async findWorkspaceClients(
    workspaceId: string,
  ): Promise<ProjectPersonRecord[]> {
    return prisma.user.findMany({
      where: {
        workspaceId,
        role: "CLIENT",
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    });
  },

  async isWorkspaceClient(
    workspaceId: string,
    clientId: string,
  ): Promise<boolean> {
    const client = await prisma.user.findFirst({
      where: {
        id: clientId,
        workspaceId,
        role: "CLIENT",
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    return client !== null;
  },

  async isWorkspaceProjectOwner(
    workspaceId: string,
    ownerId: string,
  ): Promise<boolean> {
    const owner = await prisma.user.findFirst({
      where: {
        id: ownerId,
        workspaceId,
        isActive: true,
        role: {
          not: "CLIENT",
        },
      },
      select: {
        id: true,
      },
    });

    return owner !== null;
  },

  async create(input: CreateProjectRecordInput): Promise<ProjectAuditRecord> {
    return prisma.project.create({
      data: {
        workspaceId: input.workspaceId,
        name: input.name,
        description: input.description,
        status: input.status,
        ownerId: input.ownerId,
        clientId: input.clientId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        clientId: true,
      },
    });
  },

  async update(
    input: UpdateProjectRecordInput,
  ): Promise<ProjectAuditRecord | null> {
    const result = await prisma.project.updateMany({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      data: {
        name: input.name,
        description: input.description,
        status: input.status,
        ownerId: input.ownerId,
        clientId: input.clientId,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        clientId: true,
      },
    });
  },

  async findDependencies(
    input: FindProjectInput,
  ): Promise<ProjectDependencyCounts | null> {
    const project = await prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      select: {
        _count: {
          select: {
            files: true,
            milestones: true,
            messages: true,
            invoices: true,
            proposals: true,
          },
        },
      },
    });

    return project?._count ?? null;
  },

  async delete(input: FindProjectInput): Promise<ProjectAuditRecord | null> {
    return prisma.$transaction(async (transaction) => {
      const project = await transaction.project.findFirst({
        where: {
          id: input.projectId,
          workspaceId: input.workspaceId,
        },
        select: {
          id: true,
          name: true,
          status: true,
          clientId: true,
        },
      });

      if (!project) {
        return null;
      }

      const result = await transaction.project.deleteMany({
        where: {
          id: input.projectId,
          workspaceId: input.workspaceId,
        },
      });

      return result.count > 0 ? project : null;
    });
  },
};
