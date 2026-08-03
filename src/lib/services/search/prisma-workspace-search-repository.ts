import { prisma } from "@/lib/prisma";

import type {
  WorkspaceSearchData,
  WorkspaceSearchRepository,
} from "./workspace-search-repository";

export const prismaWorkspaceSearchRepository: WorkspaceSearchRepository = {
  async searchWorkspace({
    workspaceId,
    query,
  }): Promise<WorkspaceSearchData> {
    const [
      clients,
      projects,
      bookings,
      invoices,
      messages,
      services,
    ] = await Promise.all([
      prisma.user.findMany({
        where: {
          workspaceId,
          role: "CLIENT",
          OR: [
            {
              firstName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
        take: 5,
      }),

      prisma.project.findMany({
        where: {
          workspaceId,
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        take: 5,
      }),

      prisma.booking.findMany({
        where: {
          workspaceId,
          OR: [
            {
              customerName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              customerEmail: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          customerName: true,
          date: true,
          startTime: true,
          service: {
            select: {
              name: true,
            },
          },
        },
        take: 5,
      }),

      prisma.invoice.findMany({
        where: {
          project: {
            workspaceId,
          },
        },
        select: {
          id: true,
          amount: true,
          paid: true,
          projectId: true,
          project: {
            select: {
              name: true,
            },
          },
        },
        take: 5,
      }),

      prisma.message.findMany({
        where: {
          project: {
            workspaceId,
          },
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          content: true,
          projectId: true,
          project: {
            select: {
              name: true,
            },
          },
        },
        take: 5,
      }),

      prisma.service.findMany({
        where: {
          workspaceId,
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          duration: true,
          price: true,
        },
        take: 5,
      }),
    ]);

    return {
  clients,
  projects,
  bookings,

  invoices: invoices.map((invoice) => ({
    ...invoice,
    amount: invoice.amount.toNumber(),
  })),

  messages,

  services: services.map((service) => ({
    ...service,
    price: service.price,
  })),
};
  },
};