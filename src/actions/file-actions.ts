"use server";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";
import { redirect } from "next/navigation";
import {
  ALLOWED_PROJECT_FILE_TYPES,
  MAX_PROJECT_FILE_SIZE,
  sanitizeFileName,
  validateUploadedFile,
} from "@/lib/files/file-validation";

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

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: currentUser.workspaceId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return;
  }

  const validation = validateUploadedFile(file, {
    maxSize: MAX_PROJECT_FILE_SIZE,
    allowedTypes: ALLOWED_PROJECT_FILE_TYPES,
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeFileName = sanitizeFileName(file.name);

  const key = `projects/${project.id}/${Date.now()}-${safeFileName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  const projectFile = await prisma.projectFile.create({
    data: {
      projectId: project.id,
      name: file.name,
      url: key,
      fileType: file.type || "Unknown",
    },
  });

  await createAuditLog({
    action: "FILE_UPLOADED",
    entity: "FILE",
    entityId: projectFile.id,
    userId: session.user.id,
    metadata: {
      name: projectFile.name,
      fileType: projectFile.fileType,
      projectId: projectFile.projectId,
    },
  });

  redirect(`/projects/${project.id}`);
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

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  const projectFile = await prisma.projectFile.findFirst({
    where: {
      id: fileId,
      projectId,
      project: {
        workspaceId: currentUser.workspaceId,
      },
    },
    select: {
      id: true,
      url: true,
    },
  });

  if (!projectFile) {
    return;
  }

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: projectFile.url,
    }),
  );

  await prisma.projectFile.delete({
    where: {
      id: projectFile.id,
    },
  });

  await createAuditLog({
    action: "FILE_DELETED",
    entity: "FILE",
    entityId: projectFile.id,
    userId: session.user.id,
    metadata: {
      projectId,
    },
  });

  redirect(`/projects/${projectId}`);
}
