"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createServiceSchema,
  toggleServiceActiveSchema,
} from "@/lib/validation/service";
import { redirect } from "next/navigation";

async function getWorkspaceId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
    },
  });

  return user?.workspaceId;
}

export async function createServiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const input = createServiceSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    duration: formData.get("duration"),
    priceDollars: formData.get("price"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  await prisma.service.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      duration: input.duration,
      price: Math.round(input.priceDollars * 100),
      workspaceId,
    },
  });

  redirect("/services");
}

export async function toggleServiceActiveAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const input = toggleServiceActiveSchema.parse({
    serviceId: formData.get("serviceId"),
    active: formData.get("active") === "true",
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const result = await prisma.service.updateMany({
    where: {
      id: input.serviceId,
      workspaceId,
    },
    data: {
      active: !input.active,
    },
  });

  if (result.count === 0) {
    return;
  }

  redirect("/services");
}
