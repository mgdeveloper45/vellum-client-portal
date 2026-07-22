"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  BUSINESS_DAYS,
  DEFAULT_BUSINESS_HOURS,
} from "@/lib/constants/business-hours";
import { canManageWorkspace } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { updateBusinessHoursService } from "@/lib/services/business-hours/composition/business-hours-services";

export async function updateBusinessHoursAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const businessHours = BUSINESS_DAYS.map((day) => ({
    dayOfWeek: day,
    closed: formData.get(`${day}_closed`) === "on",
    openTime: String(
      formData.get(`${day}_openTime`) ?? DEFAULT_BUSINESS_HOURS.openTime,
    ),
    closeTime: String(
      formData.get(`${day}_closeTime`) ?? DEFAULT_BUSINESS_HOURS.closeTime,
    ),
  }));

  const result = await updateBusinessHoursService({
    workspaceId,
    businessHours,
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  redirect("/settings");
}
