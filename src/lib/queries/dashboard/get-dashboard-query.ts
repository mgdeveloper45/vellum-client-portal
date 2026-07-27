import { prisma } from "@/lib/prisma";

type GetDashboardQueryInput = {
  userId: string;
  userRole: string;
  workspaceId: string;
};

const WORKSPACE_STAFF_ROLES = new Set(["OWNER", "ADMIN", "MANAGER"]);

function getDashboardDateRanges() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayStart.getDate() + 1);

  const nextSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(todayStart);
    date.setDate(todayStart.getDate() + index);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    return {
      date,
      nextDate,
      label: date.toLocaleDateString(undefined, {
        weekday: "short",
      }),
    };
  });

  return {
    todayStart,
    todayEnd,
    nextSevenDays,
  };
}

export async function getDashboardQuery({
  userId,
  userRole,
  workspaceId,
}: GetDashboardQueryInput) {
  const canViewWorkspaceData = WORKSPACE_STAFF_ROLES.has(userRole);

  const workspaceProjectFilter = canViewWorkspaceData
    ? {
        workspaceId,
      }
    : {
        workspaceId,
        clientId: userId,
      };

  const { todayStart, todayEnd, nextSevenDays } = getDashboardDateRanges();

  const now = new Date();

  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);

  const previousPeriodStart = new Date(currentPeriodStart);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

  const previousSevenDaysStart = new Date(todayStart);
  previousSevenDaysStart.setDate(previousSevenDaysStart.getDate() - 7);

  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const nextSevenDaysEnd =
    nextSevenDays.at(-1)?.nextDate ??
    new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    currentUser,

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
    nextSevenDaysBookings,

    bookingTrendCounts,
    previousSevenDaysBookings,
    cancellationsLastThirtyDays,
    totalBookingsLastThirtyDays,

    businessHours,
    activeServices,

    recentActivity,
    recentNotifications,
  ] = await Promise.all([
    prisma.user.findFirst({
      where: {
        id: userId,
        workspaceId,
      },
      select: {
        firstName: true,
      },
    }),

    canViewWorkspaceData
      ? prisma.user.count({
          where: {
            role: "CLIENT",
            workspaceId,
          },
        })
      : Promise.resolve(1),

    prisma.project.count({
      where: {
        ...workspaceProjectFilter,
        status: "ACTIVE",
      },
    }),

    prisma.project.count({
      where: {
        ...workspaceProjectFilter,
        status: "COMPLETED",
      },
    }),

    prisma.project.count({
      where: workspaceProjectFilter,
    }),

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

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: todayStart,
          lt: nextSevenDaysEnd,
        },
        status: {
          not: "CANCELLED",
        },
      },
      select: {
        date: true,
      },
    }),

    Promise.all(
      nextSevenDays.map((day) =>
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

    prisma.booking.count({
      where: {
        workspaceId,
        date: {
          gte: previousSevenDaysStart,
          lt: todayStart,
        },
        status: {
          not: "CANCELLED",
        },
      },
    }),

    prisma.booking.count({
      where: {
        workspaceId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
        status: "CANCELLED",
      },
    }),

    prisma.booking.count({
      where: {
        workspaceId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),

    prisma.businessHour.findMany({
      where: {
        workspaceId,
      },
      select: {
        dayOfWeek: true,
        openTime: true,
        closeTime: true,
        closed: true,
      },
    }),

    prisma.service.findMany({
      where: {
        workspaceId,
        active: true,
      },
      select: {
        duration: true,
        price: true,
      },
    }),

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
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  return {
    workspaceId,
    firstName: currentUser?.firstName ?? null,
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
    nextSevenDaysBookings,

    bookingTrendCounts,
    previousSevenDaysBookings,
    cancellationsLastThirtyDays,
    totalBookingsLastThirtyDays,

    businessHours,
    activeServices,

    recentActivity,
    recentNotifications,
  };
}

export type DashboardQueryResult = Awaited<
  ReturnType<typeof getDashboardQuery>
>;
