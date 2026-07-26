"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
    console.error("Client creation unauthorized", {
      hasUser: Boolean(session?.user),
      role: session?.user?.role,
    });

    throw new Error("You are not authorized to create clients.");
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
    console.error("Client creation failed: workspace missing", {
      userId: session.user.id,
    });

    throw new Error("Your account is not assigned to a workspace.");
  }

  const result = await createClientService({
    workspaceId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    notes: input.notes,
  });

  if (!result.success) {
    console.error("Client creation failed", {
      reason: result.reason,
      message: result.message,
      email: input.email,
      workspaceId,
    });

    throw new Error(
      `Client creation failed: ${result.reason} — ${result.message}`,
    );
  }

  revalidatePath("/clients");
  revalidatePath("/projects/new");

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

  revalidatePath("/clients");
  revalidatePath(`/clients/${input.clientId}`);
  revalidatePath(`/clients/${input.clientId}/edit`);
  revalidatePath("/projects/new");

  redirect(`/clients/${input.clientId}`);
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

  revalidatePath("/clients");
  revalidatePath("/projects/new");

  redirect("/clients");
}
