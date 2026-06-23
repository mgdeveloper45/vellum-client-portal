"use server";

import { auth } from "@/auth";
import { canManageProjects } from "@/lib/permissions";
import { createAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Creates a project and redirects back to the projects list.
 */
export async function createProjectAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const clientId = String(formData.get("clientId"));
  const ownerId = String(formData.get("ownerId"));

  const status = String(formData.get("status")) as
    | "PLANNING"
    | "ACTIVE"
    | "REVIEW"
    | "COMPLETED";

  const adminUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!adminUser?.workspaceId) {
    return;
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      status,
      ownerId,
      clientId,
      workspaceId: adminUser.workspaceId,
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
 * Updates a project and redirects back to the projects list.
 */
export async function updateProjectAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const projectId = String(formData.get("projectId"));
  const name = String(formData.get("name"));
  const description = String(formData.get("description"));

  const status = String(formData.get("status")) as
    | "PLANNING"
    | "ACTIVE"
    | "REVIEW"
    | "COMPLETED";

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
      description,
      status,
    },
  });

  await createAuditLog({
    action: "PROJECT_UPDATED",
    entity: "PROJECT",
    entityId: project.id,
    userId: session.user.id,
    metadata: {
      name: project.name,
      status: project.status,
    },
  });

  redirect("/projects");
}

/**
 * Deletes a project and redirects back to the projects list.
 */
export async function deleteProjectAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const projectId = String(formData.get("projectId"));

  await createAuditLog({
    action: "PROJECT_DELETED",
    entity: "PROJECT",
    entityId: projectId,
    userId: session.user.id,
  });

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  redirect("/projects");
}
