import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function loadDashboardWorkspace(userId: string) {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
      firstName: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return null;
  }

  return {
    workspaceId: currentUser.workspaceId,
    firstName: currentUser.firstName,
  };
}

export async function requireDashboardUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user;
}

export function getDashboardDateRanges() {
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
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
    };
  });

  return {
    todayStart,
    todayEnd,
    nextSevenDays,
  };
}

export async function loadDashboardCounts(
  workspaceProjectFilter: {
    workspaceId: string;
    clientId?: string;
  },
) {
  return Promise.all([
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
  ]);
}