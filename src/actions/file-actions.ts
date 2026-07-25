"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { createAuditLog } from "@/lib/audit";

import { canManageProjects } from "@/lib/permissions";

import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";

import {
  uploadProjectFileService,
  deleteProjectFileService,
} from "@/lib/services/project-files/composition/project-file-services";

export async function createProjectFileAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const projectId = String(formData.get("projectId") ?? "").trim();

  const file = formData.get("file");

  if (!projectId || !(file instanceof File)) {
    return;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const uploaded = await uploadProjectFileService.execute({
    workspaceId,
    projectId,
    file,
  });

  await createAuditLog({
    action: "FILE_UPLOADED",
    entity: "FILE",
    entityId: uploaded.id,
    userId: session.user.id,
    metadata: {
      name: uploaded.name,
      fileType: uploaded.fileType,
      projectId: uploaded.projectId,
    },
  });

  redirect(`/projects/${projectId}`);
}

export async function deleteProjectFileAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const fileId = String(formData.get("fileId") ?? "").trim();

  const projectId = String(formData.get("projectId") ?? "").trim();

  if (!fileId || !projectId) {
    return;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const deleted = await deleteProjectFileService.execute({
    workspaceId,
    projectId,
    fileId,
  });

  await createAuditLog({
    action: "FILE_DELETED",
    entity: "FILE",
    entityId: deleted.id,
    userId: session.user.id,
    metadata: {
      name: deleted.name,
      fileType: deleted.fileType,
      projectId: deleted.projectId,
    },
  });

  redirect(`/projects/${projectId}`);
}
