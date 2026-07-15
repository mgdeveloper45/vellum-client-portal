"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
} from "@/lib/validation/project";
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

/**
 * Creates a project.
 */
export async function createProjectAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const input = createProjectSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    clientId: formData.get("clientId"),
    ownerId: formData.get("ownerId"),
    status: formData.get("status"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
      ownerId: input.ownerId,
      clientId: input.clientId,
      workspaceId,
    },
  });

  await createAuditLog({
    action: "PROJECT_CREATED",
    entity: "PROJECT",
    entityId: project.id,
    userId: session.user.id,
    metadata: {
      name: project.name,
      status: project.status,
      clientId: project.clientId,
    },
  });

  redirect("/projects");
}

/**
 * Updates a project.
 */
export async function updateProjectAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const input = updateProjectSchema.parse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
    clientId: formData.get("clientId"),
    ownerId: formData.get("ownerId"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const result = await prisma.project.updateMany({
    where: {
      id: input.projectId,
      workspaceId,
    },
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
    },
  });

  if (result.count === 0) {
    return;
  }

  await createAuditLog({
    action: "PROJECT_UPDATED",
    entity: "PROJECT",
    entityId: input.projectId,
    userId: session.user.id,
    metadata: {
      name: input.name,
      status: input.status,
    },
  });

  redirect("/projects");
}

/**
 * Deletes a project.
 */
export async function deleteProjectAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const input = deleteProjectSchema.parse({
    projectId: formData.get("projectId"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  await createAuditLog({
    action: "PROJECT_DELETED",
    entity: "PROJECT",
    entityId: input.projectId,
    userId: session.user.id,
  });

  await prisma.project.deleteMany({
    where: {
      id: input.projectId,
      workspaceId,
    },
  });

  redirect("/projects");
}
