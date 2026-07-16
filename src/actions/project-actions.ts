"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { runWithRequestContext } from "@/lib/request-context";
import { createRequestId } from "@/lib/request-id";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
} from "@/lib/validation/project";

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

async function runProjectAction<T>(callback: () => Promise<T>) {
  const requestHeaders = await headers();

  const requestId = requestHeaders.get("x-request-id") ?? createRequestId();

  return runWithRequestContext(
    {
      requestId,
    },
    callback,
  );
}

/**
 * Creates a project.
 */
export async function createProjectAction(formData: FormData) {
  return runProjectAction(async () => {
    const startedAt = Date.now();
    const session = await auth();

    if (!session?.user || !canManageProjects(session.user.role)) {
      logger.warn("Project creation denied", {
        action: "PROJECT_CREATE",
        reason: "unauthorized",
      });

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
      logger.warn("Project creation denied", {
        action: "PROJECT_CREATE",
        userId: session.user.id,
        reason: "workspace_not_found",
      });

      return;
    }

    /*
     * Verify both referenced users belong to the
     * caller's workspace before creating the project.
     */
    const [owner, client] = await Promise.all([
      prisma.user.findFirst({
        where: {
          id: input.ownerId,
          workspaceId,
        },
        select: {
          id: true,
        },
      }),

      prisma.user.findFirst({
        where: {
          id: input.clientId,
          workspaceId,
          role: "CLIENT",
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!owner || !client) {
      logger.warn("Project creation denied", {
        action: "PROJECT_CREATE",
        userId: session.user.id,
        workspaceId,
        reason: "invalid_workspace_membership",
      });

      return;
    }

    const project = await prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        status: input.status,
        ownerId: owner.id,
        clientId: client.id,
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

    logger.info("Project created", {
      action: "PROJECT_CREATE",
      projectId: project.id,
      userId: session.user.id,
      workspaceId,
      durationMs: Date.now() - startedAt,
      status: "success",
    });

    redirect("/projects");
  });
}

/**
 * Updates a project.
 */
export async function updateProjectAction(formData: FormData) {
  return runProjectAction(async () => {
    const startedAt = Date.now();
    const session = await auth();

    if (!session?.user || !canManageProjects(session.user.role)) {
      logger.warn("Project update denied", {
        action: "PROJECT_UPDATE",
        reason: "unauthorized",
      });

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
      logger.warn("Project update denied", {
        action: "PROJECT_UPDATE",
        projectId: input.projectId,
        userId: session.user.id,
        reason: "workspace_not_found",
      });

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
      logger.warn("Project update denied", {
        action: "PROJECT_UPDATE",
        projectId: input.projectId,
        userId: session.user.id,
        workspaceId,
        reason: "project_not_found",
      });

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

    logger.info("Project updated", {
      action: "PROJECT_UPDATE",
      projectId: input.projectId,
      userId: session.user.id,
      workspaceId,
      durationMs: Date.now() - startedAt,
      status: "success",
    });

    redirect("/projects");
  });
}

/**
 * Deletes a project.
 */
export async function deleteProjectAction(formData: FormData) {
  return runProjectAction(async () => {
    const startedAt = Date.now();
    const session = await auth();

    if (!session?.user || !canManageProjects(session.user.role)) {
      logger.warn("Project deletion denied", {
        action: "PROJECT_DELETE",
        reason: "unauthorized",
      });

      return;
    }

    const input = deleteProjectSchema.parse({
      projectId: formData.get("projectId"),
    });

    const workspaceId = await getWorkspaceId(session.user.id);

    if (!workspaceId) {
      logger.warn("Project deletion denied", {
        action: "PROJECT_DELETE",
        projectId: input.projectId,
        userId: session.user.id,
        reason: "workspace_not_found",
      });

      return;
    }

    /*
     * Verify the project exists before recording a
     * deletion audit event.
     */
    const project = await prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        clientId: true,
      },
    });

    if (!project) {
      logger.warn("Project deletion denied", {
        action: "PROJECT_DELETE",
        projectId: input.projectId,
        userId: session.user.id,
        workspaceId,
        reason: "project_not_found",
      });

      return;
    }

    await prisma.project.delete({
      where: {
        id: project.id,
      },
    });

    await createAuditLog({
      action: "PROJECT_DELETED",
      entity: "PROJECT",
      entityId: project.id,
      userId: session.user.id,
      metadata: {
        name: project.name,
        status: project.status,
        clientId: project.clientId,
      },
    });

    logger.info("Project deleted", {
      action: "PROJECT_DELETE",
      projectId: project.id,
      userId: session.user.id,
      workspaceId,
      durationMs: Date.now() - startedAt,
      status: "success",
    });

    redirect("/projects");
  });
}
