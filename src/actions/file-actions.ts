"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";
import { redirect } from "next/navigation";

export async function createProjectFileAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const projectId = String(formData.get("projectId"));
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const key = `projects/${projectId}/${Date.now()}-${file.name}`;

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
      projectId,
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
