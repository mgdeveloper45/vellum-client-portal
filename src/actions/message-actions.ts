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

  const createdMessage = await prisma.message.create({
    data: {
      projectId,
      senderId: session.user.id,
      content,
    },
  });

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (project) {
    const recipientId =
      session.user.id === project.clientId ? project.ownerId : project.clientId;

    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: "New project message",
        message:
          createdMessage.content.length > 100
            ? `${createdMessage.content.slice(0, 100)}...`
            : createdMessage.content,
      },
    });
  }

  redirect(`/projects/${projectId}`);
}
