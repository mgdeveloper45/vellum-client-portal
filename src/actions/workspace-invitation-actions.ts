"use server";

import { auth } from "@/auth";
import { sendWorkspaceInvitationEmail } from "@/lib/email";
import {
  acceptWorkspaceInvitationService,
  createWorkspaceInvitationService,
} from "@/lib/services/workspace/composition/workspace-invitation-services";
import type { WorkspaceInvitationRole } from "@/lib/services/workspace/workspace-invitation-repository";
import { redirect } from "next/navigation";

export async function createWorkspaceInvitationAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }

  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "") as WorkspaceInvitationRole;

  const result = await createWorkspaceInvitationService({
    invitedById: session.user.id,
    email,
    role,
  });

  if (result.status !== "created") {
    return;
  }

  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error(
      "APP_URL is required to create workspace invitation links.",
    );
  }

  const inviteUrl = `${appUrl}/accept-invite?token=${result.invitation.token}`;

  await sendWorkspaceInvitationEmail({
    email: result.invitation.email,
    workspaceName: result.invitation.workspaceName,
    inviteUrl,
  });

  redirect("/workspace");
}

export async function acceptWorkspaceInvitationAction(formData: FormData) {
  const result = await acceptWorkspaceInvitationService({
    token: String(formData.get("token") ?? ""),
    email: String(formData.get("email") ?? ""),
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (result.status !== "accepted") {
    return;
  }

  redirect("/sign-in");
}
