"use server";

import { auth } from "@/auth";
import { canManageWorkspace } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createServiceService,
  toggleServiceActiveService,
} from "@/lib/services/service/composition/service-services";
import {
  createServiceSchema,
  toggleServiceActiveSchema,
} from "@/lib/validation/service";
import { redirect } from "next/navigation";

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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await createServiceService.execute({
    workspaceId,
    name: input.name,
    description: input.description,
    duration: input.duration,
    priceDollars: input.priceDollars,
  });

  if (!result.success) {
    return;
  }

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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await toggleServiceActiveService.execute({
    serviceId: input.serviceId,
    workspaceId,
    active: input.active,
  });

  if (!result.success) {
    return;
  }

  redirect("/services");
}
