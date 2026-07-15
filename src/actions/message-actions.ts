"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { sendProjectMessageEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { createMessageSchema } from "@/lib/validation/message";
import { redirect } from "next/navigation";

function createMessagePreview(content: string) {
  return content.length > 100 ? `${content.slice(0, 100)}...` : content;
}

/**
 * Creates a project message from an authorized
 * project participant.
 */
export async function createMessageAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const input = createMessageSchema.parse({
    projectId: formData.get("projectId"),
    content: formData.get("content"),
  });

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      workspaceId: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!currentUser) {
    return;
  }

  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,

      OR: [
        {
          clientId: currentUser.id,
        },

        ...(currentUser.workspaceId
          ? [
              {
                workspaceId: currentUser.workspaceId,
              },
            ]
          : []),
      ],
    },

    include: {
      client: true,
      owner: true,
    },
  });

  if (!project) {
    return;
  }

  const createdMessage = await prisma.message.create({
    data: {
      projectId: project.id,
      senderId: currentUser.id,
      content: input.content,
    },
  });

  const preview = createMessagePreview(createdMessage.content);

  await createAuditLog({
    action: "MESSAGE_SENT",
    entity: "MESSAGE",
    entityId: createdMessage.id,
    userId: currentUser.id,
    metadata: {
      projectId: project.id,
      preview,
    },
  });

  const senderIsClient = currentUser.id === project.clientId;

  const recipient = senderIsClient ? project.owner : project.client;

  if (recipient.id !== currentUser.id) {
    await prisma.notification.create({
      data: {
        userId: recipient.id,
        title: "New project message",
        message: preview,
        type: "MESSAGE",
        href: `/projects/${project.id}`,
      },
    });

    const senderName =
      session.user.name?.trim() ||
      `${currentUser.firstName} ${currentUser.lastName}`.trim() ||
      "Vellum User";

    await sendProjectMessageEmail({
      email: recipient.email,
      projectName: project.name,
      senderName,
      message: createdMessage.content,
      projectUrl: `${process.env.APP_URL}/projects/${project.id}`,
    });
  }

  redirect(`/projects/${project.id}`);
}
