"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { sendProjectMessageEmail } from "@/lib/email";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { createMessageService } from "@/lib/services/messages/composition/message-services";
import { createMessageSchema } from "@/lib/validation/message";

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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await createMessageService({
    workspaceId,
    projectId: input.projectId,
    senderId: session.user.id,
    content: input.content,
    canManageProjects: canManageProjects(session.user.role),
    sessionSenderName: session.user.name,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "MESSAGE_SENT",
    entity: "MESSAGE",
    entityId: result.message.id,
    userId: session.user.id,
    metadata: {
      projectId: result.message.projectId,
      preview: result.preview,
    },
  });

  if (result.emailDelivery) {
    const appUrl = process.env.APP_URL;

    if (appUrl) {
      await sendProjectMessageEmail({
        email: result.emailDelivery.recipientEmail,
        projectName: result.emailDelivery.projectName,
        senderName: result.emailDelivery.senderName,
        message: result.emailDelivery.content,
        projectUrl: `${appUrl}/projects/${result.emailDelivery.projectId}`,
      });
    }
  }

  revalidatePath("/messages");
  revalidatePath(`/projects/${result.message.projectId}`);

  redirect(`/projects/${result.message.projectId}`);
}
