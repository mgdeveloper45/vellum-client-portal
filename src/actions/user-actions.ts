"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageUsers } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createUserSchema, updateUserSchema } from "@/lib/validation/user";

async function getManagingUserWorkspace(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
    },
  });
}

export async function createUserAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageUsers(session.user.role)) {
    return;
  }

  const input = createUserSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });

  const managingUser = await getManagingUserWorkspace(session.user.id);

  if (!managingUser?.workspaceId) {
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const createdUser = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: input.role,
      password: hashedPassword,
      isActive: true,
      workspaceId: managingUser.workspaceId,
    },
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

  if (!session?.user || !canManageUsers(session.user.role)) {
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

  const managingUser = await getManagingUserWorkspace(session.user.id);

  if (!managingUser?.workspaceId) {
    return;
  }

  const existingEmailOwner = await prisma.user.findFirst({
    where: {
      email: input.email,
      id: {
        not: input.userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingEmailOwner) {
    throw new Error("A user with this email already exists.");
  }

  const targetUser = await prisma.user.findFirst({
    where: {
      id: input.userId,
      workspaceId: managingUser.workspaceId,
    },
    select: {
      id: true,
      role: true,
      isActive: true,
    },
  });

  if (!targetUser) {
    return;
  }

  if (targetUser.id === session.user.id && !input.isActive) {
    throw new Error("You cannot deactivate your own account.");
  }

  const result = await prisma.user.updateMany({
    where: {
      id: input.userId,
      workspaceId: managingUser.workspaceId,
    },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: input.role,
      isActive: input.isActive,
    },
  });

  if (result.count === 0) {
    return;
  }

  await createAuditLog({
    action: "USER_UPDATED",
    entity: "USER",
    entityId: input.userId,
    userId: session.user.id,
    metadata: {
      email: input.email,
      previousRole: targetUser.role,
      role: input.role,
      previousIsActive: targetUser.isActive,
      isActive: input.isActive,
    },
  });

  redirect("/users");
}
