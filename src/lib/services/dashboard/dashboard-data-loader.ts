import { prisma } from "@/lib/prisma";
import {
  getDashboardDateRanges,
  loadDashboardCounts,
} from "@/lib/dashboard/dashboard-loader";

export async function loadDashboardData(user: {
  id: string;
  role: string;
  workspaceId: string;
}) {
  const workspaceId = user.workspaceId;

  const workspaceProjectFilter =
    user.role === "ADMIN"
      ? { workspaceId }
      : {
          workspaceId,
          clientId: user.id,
        };

  const { todayStart, todayEnd, nextSevenDays } = getDashboardDateRanges();

  type DashboardDay = (typeof nextSevenDays)[number];

  const now = new Date();

  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);

  const previousPeriodStart = new Date(currentPeriodStart);

  previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

  const [
    totalClients,
    activeProjects,
    completedProjects,
    totalProjects,
    openInvoices,
    totalInvoices,
    paidInvoices,
    totalRevenue,
    outstandingRevenue,
    previousPeriodRevenue,
    pendingMilestones,
    approvedProposals,
    totalProposals,
    todaysBookings,
    upcomingBookings,
    upcomingBookingsForForecast,
    bookingTrendCounts,
    recentActivity,
    recentNotifications,
  ] = await Promise.all([
    user.role === "ADMIN"
      ? prisma.user.count({
          where: {
            role: "CLIENT",
            workspaceId,
          },
        })
      : Promise.resolve(1),

    ...(await loadDashboardCounts(workspaceProjectFilter)),

    prisma.invoice.count({
      where: {
        paid: false,
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.count({
      where: {
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.count({
      where: {
        paid: true,
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paid: true,
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paid: false,
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paid: true,
        createdAt: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
        project: workspaceProjectFilter,
      },
    }),

    prisma.milestone.count({
      where: {
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
        project: workspaceProjectFilter,
      },
    }),

    prisma.proposal.count({
      where: {
        approved: true,
        project: workspaceProjectFilter,
      },
    }),

    prisma.proposal.count({
      where: {
        project: workspaceProjectFilter,
      },
    }),

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        startTime: "asc",
      },
      take: 6,
    }),

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: todayStart,
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        service: true,
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          startTime: "asc",
        },
      ],
      take: 5,
    }),

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: todayStart,
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        service: {
          select: {
            price: true,
          },
        },
      },
    }),

    Promise.all(
      nextSevenDays.map((day: DashboardDay) =>
        prisma.booking.count({
          where: {
            workspaceId,
            date: {
              gte: day.date,
              lt: day.nextDate,
            },
            status: {
              not: "CANCELLED",
            },
          },
        }),
      ),
    ),

    prisma.auditLog.findMany({
      where: {
        user: {
          workspaceId,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),

    prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  return {
    workspaceId,
    nextSevenDays,

    totalClients,
    activeProjects,
    completedProjects,
    totalProjects,

    openInvoices,
    totalInvoices,
    paidInvoices,

    totalRevenue,
    outstandingRevenue,
    previousPeriodRevenue,

    pendingMilestones,

    approvedProposals,
    totalProposals,

    todaysBookings,
    upcomingBookings,
    upcomingBookingsForForecast,

    bookingTrendCounts,

    recentActivity,
    recentNotifications,
  };
}
