"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Creates a project message from the signed-in user.
 */
export async function createMessageAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const projectId = String(formData.get("projectId"));
  const content = String(formData.get("content"));

  await prisma.message.create({
    data: {
      projectId,
      senderId: session.user.id,
      content,
    },
  });

  redirect(`/projects/${projectId}`);
}