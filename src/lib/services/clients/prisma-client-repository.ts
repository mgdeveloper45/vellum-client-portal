import { prisma } from "../../prisma";

import type {
  ClientDetailRecord,
  ClientEditRecord,
  ClientRepository,
  ClientSummaryRecord,
  CreateClientRecordInput,
  DeleteClientRecordInput,
  FindClientByEmailInput,
  FindClientInput,
  FindClientsInput,
  UpdateClientRecordInput,
} from "./client-repository";

export const prismaClientRepository: ClientRepository = {
  async findMany({
    workspaceId,
    clientId,
  }: FindClientsInput): Promise<ClientSummaryRecord[]> {
    const clients = await prisma.user.findMany({
      where: {
        workspaceId,
        role: "CLIENT",
        ...(clientId
          ? {
              id: clientId,
            }
          : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        _count: {
          select: {
            clientProjects: true,
          },
        },
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

    return clients.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      projectCount: client._count.clientProjects,
    }));
  },

  async findDetail({
    workspaceId,
    clientId,
  }: FindClientInput): Promise<ClientDetailRecord | null> {
    return prisma.user.findFirst({
      where: {
        id: clientId,
        workspaceId,
        role: "CLIENT",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        notes: true,
        isBlacklisted: true,
        clientProjects: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            messages: {
              select: {
                id: true,
              },
            },
            invoices: {
              select: {
                id: true,
                amount: true,
                paid: true,
              },
            },
            proposals: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  },

  async findForEdit({
    workspaceId,
    clientId,
  }: FindClientInput): Promise<ClientEditRecord | null> {
    return prisma.user.findFirst({
      where: {
        id: clientId,
        workspaceId,
        role: "CLIENT",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        notes: true,
        isBlacklisted: true,
      },
    });
  },

  async findByEmail({
    email,
    excludeClientId,
  }: FindClientByEmailInput): Promise<{
    id: string;
  } | null> {
    return prisma.user.findFirst({
      where: {
        email,
        ...(excludeClientId
          ? {
              id: {
                not: excludeClientId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });
  },

  async create(input: CreateClientRecordInput): Promise<{
    id: string;
  }> {
    return prisma.user.create({
      data: {
        workspaceId: input.workspaceId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        notes: input.notes,
        password: input.password,
        role: "CLIENT",
      },
      select: {
        id: true,
      },
    });
  },

  async update(input: UpdateClientRecordInput): Promise<boolean> {
    const result = await prisma.user.updateMany({
      where: {
        id: input.clientId,
        workspaceId: input.workspaceId,
        role: "CLIENT",
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        notes: input.notes,
        isBlacklisted: input.isBlacklisted,
      },
    });

    return result.count > 0;
  },

  async countProjects({
    workspaceId,
    clientId,
  }: FindClientInput): Promise<number | null> {
    const client = await prisma.user.findFirst({
      where: {
        id: clientId,
        workspaceId,
        role: "CLIENT",
      },
      select: {
        _count: {
          select: {
            clientProjects: true,
          },
        },
      },
    });

    return client?._count.clientProjects ?? null;
  },

  async delete(input: DeleteClientRecordInput): Promise<boolean> {
    const result = await prisma.user.deleteMany({
      where: {
        id: input.clientId,
        workspaceId: input.workspaceId,
        role: "CLIENT",
      },
    });

    return result.count > 0;
  },
};
