"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  ALLOWED_LOGO_FILE_TYPES,
  MAX_LOGO_FILE_SIZE,
  validateUploadedFile,
} from "@/lib/files/file-validation";
import { canManageWorkspace } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { uploadWorkspaceLogoService } from "@/lib/services/branding/composition/branding-services";

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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  await uploadWorkspaceLogoService.execute({
    workspaceId,
    logo,
  });

  redirect("/settings");
}
