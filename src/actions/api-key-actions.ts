"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createApiKey, revokeApiKey } from "@/lib/services/api/api-key-service";
import { redirect } from "next/navigation";

export async function createApiKeyAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
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

  const { rawKey } = await createApiKey({
    name,
    workspaceId: currentUser.workspaceId,
  });

  redirect(`/settings?apiKey=${rawKey}`);
}

export async function revokeApiKeyAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const apiKeyId = String(formData.get("apiKeyId") ?? "");

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId || !apiKeyId) {
    return;
  }

  await revokeApiKey({
    apiKeyId,
    workspaceId: currentUser.workspaceId,
  });

  redirect("/settings");
}
