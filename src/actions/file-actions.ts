"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProjects } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProjectFileAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const projectId = String(formData.get("projectId"));

  const name = String(formData.get("name"));

  const url = String(formData.get("url"));

  const fileType = String(formData.get("fileType"));

  const file = await prisma.projectFile.create({
    data: {
      projectId,
      name,
      url,
      fileType,
    },
  });

  await createAuditLog({
    action: "FILE_UPLOADED",
    entity: "FILE",
    entityId: file.id,
    userId: session.user.id,
    metadata: {
      name: file.name,
      fileType: file.fileType,
      projectId: file.projectId,
    },
  });

  redirect(`/projects/${projectId}`);
}

export async function deleteProjectFileAction(formData: FormData) {
  const session = await auth();
  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const fileId = String(formData.get("fileId"));

  const projectId = String(formData.get("projectId"));

  await prisma.projectFile.delete({
    where: {
      id: fileId,
    },
  });

  redirect(`/projects/${projectId}`);
}
