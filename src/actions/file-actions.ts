"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProjectFileAction(formData: FormData) {
  const projectId = String(formData.get("projectId"));

  const name = String(formData.get("name"));

  const url = String(formData.get("url"));

  const fileType = String(formData.get("fileType"));

  await prisma.projectFile.create({
    data: {
      projectId,
      name,
      url,
      fileType,
    },
  });

  redirect(`/projects/${projectId}`);
}

export async function deleteProjectFileAction(formData: FormData) {
  const fileId = String(formData.get("fileId"));

  const projectId = String(formData.get("projectId"));

  await prisma.projectFile.delete({
    where: {
      id: fileId,
    },
  });

  redirect(`/projects/${projectId}`);
}
