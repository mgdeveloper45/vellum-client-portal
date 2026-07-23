"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { runWithRequestContext } from "@/lib/request-context";
import { createRequestId } from "@/lib/request-id";
import {
  createProjectService,
  deleteProjectService,
  updateProjectService,
} from "@/lib/services/projects/composition/project-services";
import {
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema,
} from "@/lib/validation/project";
import { revalidatePath } from "next/cache";

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

    const workspaceId =
      await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
        session.user.id,
      );

    if (!workspaceId) {
      logger.warn("Project creation denied", {
        action: "PROJECT_CREATE",
        userId: session.user.id,
        reason: "workspace_not_found",
      });

      return;
    }

    const result = await createProjectService({
      workspaceId,
      ...input,
    });

    if (!result.success) {
      logger.warn("Project creation denied", {
        action: "PROJECT_CREATE",
        userId: session.user.id,
        workspaceId,
        reason: result.reason,
      });

      return;
    }

    await createAuditLog({
      action: "PROJECT_CREATED",
      entity: "PROJECT",
      entityId: result.project.id,
      userId: session.user.id,
      metadata: {
        name: result.project.name,
        status: result.project.status,
        clientId: result.project.clientId,
      },
    });

    logger.info("Project created", {
      action: "PROJECT_CREATE",
      projectId: result.project.id,
      userId: session.user.id,
      workspaceId,
      durationMs: Date.now() - startedAt,
      status: "success",
    });

    revalidatePath("/projects");
    revalidatePath(`/clients/${result.project.clientId}`);

    redirect("/projects");
  });
}

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

    const workspaceId =
      await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
        session.user.id,
      );

    if (!workspaceId) {
      logger.warn("Project update denied", {
        action: "PROJECT_UPDATE",
        projectId: input.projectId,
        userId: session.user.id,
        reason: "workspace_not_found",
      });

      return;
    }

    const result = await updateProjectService({
      workspaceId,
      ...input,
    });

    if (!result.success) {
      logger.warn("Project update denied", {
        action: "PROJECT_UPDATE",
        projectId: input.projectId,
        userId: session.user.id,
        workspaceId,
        reason: result.reason,
      });

      return;
    }

    await createAuditLog({
      action: "PROJECT_UPDATED",
      entity: "PROJECT",
      entityId: result.project.id,
      userId: session.user.id,
      metadata: {
        name: result.project.name,
        status: result.project.status,
        clientId: result.project.clientId,
      },
    });

    logger.info("Project updated", {
      action: "PROJECT_UPDATE",
      projectId: result.project.id,
      userId: session.user.id,
      workspaceId,
      durationMs: Date.now() - startedAt,
      status: "success",
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${result.project.id}`);
    revalidatePath(`/projects/${result.project.id}/edit`);
    revalidatePath(`/clients/${result.project.clientId}`);

    redirect(`/projects/${result.project.id}`);
  });
}

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

    const workspaceId =
      await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
        session.user.id,
      );

    if (!workspaceId) {
      logger.warn("Project deletion denied", {
        action: "PROJECT_DELETE",
        projectId: input.projectId,
        userId: session.user.id,
        reason: "workspace_not_found",
      });

      return;
    }

    const result = await deleteProjectService({
      workspaceId,
      projectId: input.projectId,
    });

    if (!result.success) {
      logger.warn("Project deletion denied", {
        action: "PROJECT_DELETE",
        projectId: input.projectId,
        userId: session.user.id,
        workspaceId,
        reason: result.reason,
      });

      return;
    }

    await createAuditLog({
      action: "PROJECT_DELETED",
      entity: "PROJECT",
      entityId: result.project.id,
      userId: session.user.id,
      metadata: {
        name: result.project.name,
        status: result.project.status,
        clientId: result.project.clientId,
      },
    });

    logger.info("Project deleted", {
      action: "PROJECT_DELETE",
      projectId: result.project.id,
      userId: session.user.id,
      workspaceId,
      durationMs: Date.now() - startedAt,
      status: "success",
    });

    revalidatePath("/projects");
    revalidatePath(`/clients/${result.project.clientId}`);

    redirect("/projects");
  });
}
