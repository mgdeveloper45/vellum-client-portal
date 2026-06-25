"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { canManageWorkspace } from "@/lib/permissions";
import { getR2PublicUrl, uploadFileToR2 } from "@/lib/r2";

export async function uploadWorkspaceLogoAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const logo = formData.get("logo");

  if (!(logo instanceof File) || logo.size === 0) {
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

  const key = await uploadFileToR2({
    file: logo,
    folder: `workspaces/${currentUser.workspaceId}/branding`,
  });

  await prisma.workspace.update({
    where: {
      id: currentUser.workspaceId,
    },
    data: {
      logoImageUrl: getR2PublicUrl(key),
    },
  });

  redirect("/settings");
}
