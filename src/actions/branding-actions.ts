"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function updateWorkspaceBrandingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const companyName = String(formData.get("companyName") ?? "").trim();
  const slug = createSlug(companyName);
  const accentColor = String(formData.get("accentColor") ?? "").trim();
  const customDomain = String(formData.get("customDomain") ?? "").trim();

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
      companyName: companyName || null,
      slug: slug || null,
      accentColor: accentColor || "#8B5CF6",
      customDomain: customDomain || null,
    },
  });

  redirect("/settings");
}
