"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { sendProjectMessageEmail } from "@/lib/email";

/**
 * Creates a project message from the signed-in user.
 */
export async function createMessageAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const projectId = String(formData.get("projectId"));
  const content = String(formData.get("content")).trim();

  if (!content) {
    return;
  }

  const createdMessage = await prisma.message.create({
    data: {
      projectId,
      senderId: session.user.id,
      content,
    },
  });

  await createAuditLog({
    action: "MESSAGE_SENT",
    entity: "MESSAGE",
    entityId: createdMessage.id,
    userId: session.user.id,
    metadata: {
      projectId,
      preview:
        createdMessage.content.length > 100
          ? `${createdMessage.content.slice(0, 100)}...`
          : createdMessage.content,
    },
  });

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      client: true,
      owner: true,
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

    const recipient =
      session.user.id === project.clientId ? project.owner : project.client;

    const senderName = session.user.name || "Vellum User";

    await sendProjectMessageEmail({
      email: recipient.email,
      projectName: project.name,
      senderName,
      message: createdMessage.content,
      projectUrl: `${process.env.APP_URL}/projects/${project.id}`,
    });
  }

  redirect(`/projects/${projectId}`);
}
