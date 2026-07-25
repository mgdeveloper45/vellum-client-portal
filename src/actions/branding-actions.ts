"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { updateWorkspaceBrandingService } from "@/lib/services/branding/composition/branding-services";

export async function updateWorkspaceBrandingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const companyName = String(formData.get("companyName") ?? "").trim();

  const accentColor = String(formData.get("accentColor") ?? "").trim();

  const customDomain = String(formData.get("customDomain") ?? "").trim();

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  await updateWorkspaceBrandingService.execute({
    workspaceId,
    companyName,
    accentColor,
    customDomain,
  });

  redirect("/settings");
}
