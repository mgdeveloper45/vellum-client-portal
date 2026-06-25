"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateWorkspaceBrandingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const companyName = String(formData.get("companyName")).trim();
  const logoImageUrl = String(formData.get("logoImageUrl")).trim();
  const accentColor = String(formData.get("accentColor")).trim();
  const customDomain = String(formData.get("customDomain")).trim();

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

  await prisma.workspace.update({
    where: {
      id: currentUser.workspaceId,
    },
    data: {
      companyName,
      logoImageUrl,
      accentColor,
      customDomain,
    },
  });

  redirect("/settings");
}
