"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createApiKeyService,
  revokeApiKeyService,
} from "@/lib/services/api/composition/api-key-services";
import { redirect } from "next/navigation";

export async function createApiKeyAction(
  formData: FormData,
) {
  const session = await auth();

  if (
    !session?.user ||
    !canManageWorkspace(session.user.role)
  ) {
    return;
  }

  const name = String(
    formData.get("name") ?? "",
  ).trim();

  if (!name) {
    return;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const { rawKey } =
    await createApiKeyService.execute({
      name,
      workspaceId,
    });

  redirect(`/settings?apiKey=${rawKey}`);
}

export async function revokeApiKeyAction(
  formData: FormData,
) {
  const session = await auth();

  if (
    !session?.user ||
    !canManageWorkspace(session.user.role)
  ) {
    return;
  }

  const apiKeyId = String(
    formData.get("apiKeyId") ?? "",
  );

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId || !apiKeyId) {
    return;
  }

  await revokeApiKeyService.execute({
    apiKeyId,
    workspaceId,
  });

  redirect("/settings");
}