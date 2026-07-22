"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageClients } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createClientSchema,
  deleteClientSchema,
  updateClientSchema,
} from "@/lib/validation/client";

/**
 * Creates a new client user.
 * Temporary password is used for development until invite emails are added.
 */
export async function createClientAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageClients(session.user.role)) {
    return;
  }

  const input = createClientSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      notes: input.notes,
      password: hashedPassword,
      role: "CLIENT",
      workspaceId,
    },
  });

  redirect("/clients");
}

/**
 * Updates an existing client profile.
 */
export async function updateClientAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageClients(session.user.role)) {
    return;
  }

  const input = updateClientSchema.parse({
    clientId: formData.get("clientId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    notes: formData.get("notes"),
    isBlacklisted: formData.get("isBlacklisted") === "on",
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await prisma.user.updateMany({
    where: {
      id: input.clientId,
      role: "CLIENT",
      workspaceId,
    },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      notes: input.notes,
      isBlacklisted: input.isBlacklisted,
    },
  });

  if (result.count === 0) {
    return;
  }

  redirect(`/clients/${input.clientId}`);
}

/**
 * Deletes a client account.
 */
export async function deleteClientAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageClients(session.user.role)) {
    return;
  }

  const input = deleteClientSchema.parse({
    clientId: formData.get("clientId"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  await prisma.user.deleteMany({
    where: {
      id: input.clientId,
      role: "CLIENT",
      workspaceId,
    },
  });

  redirect("/clients");
}
