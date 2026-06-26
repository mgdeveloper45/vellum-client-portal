"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  BUSINESS_DAYS,
  DEFAULT_BUSINESS_HOURS,
} from "@/lib/constants/business-hours";
import { redirect } from "next/navigation";

export async function updateBusinessHoursAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  await Promise.all(
    BUSINESS_DAYS.map((day) => {
      const closed = formData.get(`${day}_closed`) === "on";

      const openTime = String(
        formData.get(`${day}_openTime`) ?? DEFAULT_BUSINESS_HOURS.openTime,
      );

      const closeTime = String(
        formData.get(`${day}_closeTime`) ?? DEFAULT_BUSINESS_HOURS.closeTime,
      );

      return prisma.businessHour.upsert({
        where: {
          workspaceId_dayOfWeek: {
            workspaceId: currentUser.workspaceId!,
            dayOfWeek: day,
          },
        },
        update: {
          closed,
          openTime,
          closeTime,
        },
        create: {
          workspaceId: currentUser.workspaceId!,
          dayOfWeek: day,
          closed,
          openTime,
          closeTime,
        },
      });
    }),
  );

  redirect("/settings");
}
