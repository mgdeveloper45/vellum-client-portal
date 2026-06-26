"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createServiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const duration = Number(formData.get("duration"));
  const priceDollars = Number(formData.get("price"));

  if (
    !name ||
    !duration ||
    Number.isNaN(duration) ||
    Number.isNaN(priceDollars)
  ) {
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

  await prisma.service.create({
    data: {
      name,
      description: description || null,
      duration,
      price: Math.round(priceDollars * 100),
      workspaceId: currentUser.workspaceId,
    },
  });

  redirect("/services");
}

export async function toggleServiceActiveAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const serviceId = String(formData.get("serviceId") ?? "");
  const active = String(formData.get("active") ?? "") === "true";

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId || !serviceId) {
    return;
  }

  await prisma.service.update({
    where: {
      id: serviceId,
      workspaceId: currentUser.workspaceId,
    },
    data: {
      active: !active,
    },
  });

  redirect("/services");
}
