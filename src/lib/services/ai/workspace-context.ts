import { prisma } from "@/lib/prisma";

export async function getWorkspaceAIContext({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) {
  const [
    activeProjects,
    todaysBookings,
    upcomingBookings,
    unpaidInvoices,
    unreadNotifications,
    recentMessages,
  ] = await Promise.all([
    prisma.project.findMany({
      where: {
        workspaceId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
      take: 10,
    }),

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(24, 0, 0, 0)),
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        service: true,
      },
      take: 10,
    }),

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: new Date(),
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        service: true,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 10,
    }),

    prisma.invoice.findMany({
      where: {
        paid: false,
        project: {
          workspaceId,
        },
      },
      include: {
        project: true,
      },
      take: 10,
    }),

    prisma.notification.findMany({
      where: {
        userId,
        read: false,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.message.findMany({
      where: {
        project: {
          workspaceId,
        },
      },
      include: {
        project: true,
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ]);

  return {
  activeProjects,
  todaysBookings,
  upcomingBookings,

  unpaidInvoices: unpaidInvoices.map((invoice) => ({
    ...invoice,
    amount: Number(invoice.amount),
  })),

  unreadNotifications,
  recentMessages,
};
}
