"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { canManageWorkspace } from "@/lib/permissions";
import { deleteFileFromR2, getR2PublicUrl, uploadFileToR2 } from "@/lib/r2";
import {
  ALLOWED_LOGO_FILE_TYPES,
  MAX_LOGO_FILE_SIZE,
  validateUploadedFile,
} from "@/lib/files/file-validation";

export async function uploadWorkspaceLogoAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const logo = formData.get("logo");

  if (!(logo instanceof File)) {
    return;
  }

  const validation = validateUploadedFile(logo, {
    maxSize: MAX_LOGO_FILE_SIZE,
    allowedTypes: ALLOWED_LOGO_FILE_TYPES,
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
      workspace: {
        select: {
          logoImageUrl: true,
        },
      },
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  const key = await uploadFileToR2({
    file: logo,
    folder: `workspaces/${currentUser.workspaceId}/branding`,
  });

  const previousLogoUrl = currentUser.workspace?.logoImageUrl;

  await prisma.workspace.update({
    where: {
      id: currentUser.workspaceId,
    },
    data: {
      logoImageUrl: getR2PublicUrl(key),
    },
  });

  const publicBaseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

  if (
    previousLogoUrl &&
    publicBaseUrl &&
    previousLogoUrl.startsWith(`${publicBaseUrl}/`)
  ) {
    const previousKey = previousLogoUrl.slice(publicBaseUrl.length + 1);

    if (previousKey && previousKey !== key) {
      await deleteFileFromR2(previousKey).catch(() => undefined);
    }
  }

  redirect("/settings");
}
