"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageUsers } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createUserService,
  updateUserService,
} from "@/lib/services/users/composition/user-management-services";
import { createUserSchema, updateUserSchema } from "@/lib/validation/user";

export async function createUserAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id || !canManageUsers(session.user.role)) {
    return;
  }

  const input = createUserSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const createdUser = await createUserService.execute({
    workspaceId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    role: input.role,
    password: input.password,
  });

  await createAuditLog({
    action: "USER_CREATED",
    entity: "USER",
    entityId: createdUser.id,
    userId: session.user.id,
    metadata: {
      email: createdUser.email,
      role: createdUser.role,
      workspaceId: createdUser.workspaceId,
    },
  });

  redirect("/users");
}

export async function updateUserAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id || !canManageUsers(session.user.role)) {
    return;
  }

  const input = updateUserSchema.parse({
    userId: formData.get("userId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    role: formData.get("role"),
    isActive: formData.get("isActive") === "on",
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await updateUserService.execute({
    managingUserId: session.user.id,
    workspaceId,
    userId: input.userId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    role: input.role,
    isActive: input.isActive,
  });

  if (!result) {
    return;
  }

  await createAuditLog({
    action: "USER_UPDATED",
    entity: "USER",
    entityId: input.userId,
    userId: session.user.id,
    metadata: {
      email: input.email,
      previousRole: result.previousUser.role,
      role: input.role,
      previousIsActive: result.previousUser.isActive,
      isActive: input.isActive,
    },
  });

  redirect("/users");
}
