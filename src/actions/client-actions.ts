"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { canManageClients } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createClientService,
  deleteClientService,
  updateClientService,
} from "@/lib/services/clients/composition/client-services";
import {
  createClientSchema,
  deleteClientSchema,
  updateClientSchema,
} from "@/lib/validation/client";

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

  const passwordHash = await bcrypt.hash("password123", 10);

  const result = await createClientService({
    workspaceId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    notes: input.notes,
    passwordHash,
  });

  if (!result.success) {
    return;
  }

  redirect("/clients");
}

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

  const result = await updateClientService({
    workspaceId,
    clientId: input.clientId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    notes: input.notes,
    isBlacklisted: input.isBlacklisted,
  });

  if (!result.success) {
    return;
  }

  redirect(`/clients/${result.clientId}`);
}

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

  const result = await deleteClientService({
    workspaceId,
    clientId: input.clientId,
  });

  if (!result.success) {
    return;
  }

  redirect("/clients");
}
