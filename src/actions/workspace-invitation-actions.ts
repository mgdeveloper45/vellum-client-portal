"use server";

import crypto from "crypto";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { sendWorkspaceInvitationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createWorkspaceInvitationAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }

  const email = String(formData.get("email")).trim();
  const role = String(formData.get("role")) as "ADMIN" | "CLIENT";

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
      workspace: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!currentUser?.workspaceId) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invitation = await prisma.workspaceInvitation.create({
    data: {
      email,
      role,
      token,
      workspaceId: currentUser.workspaceId,
      invitedById: session.user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const inviteUrl = `${process.env.APP_URL}/accept-invite?token=${invitation.token}`;

  await sendWorkspaceInvitationEmail({
    email: invitation.email,
    workspaceName: currentUser.workspace?.name ?? "Vellum Workspace",
    inviteUrl,
  });

  redirect("/workspace");
}

export async function acceptWorkspaceInvitationAction(formData: FormData) {
  const token = String(formData.get("token"));
  const email = String(formData.get("email")).trim();
  const firstName = String(formData.get("firstName")).trim();
  const lastName = String(formData.get("lastName")).trim();
  const password = String(formData.get("password"));

  const invitation = await prisma.workspaceInvitation.findUnique({
    where: {
      token,
    },
  });

  if (
    !invitation ||
    invitation.acceptedAt ||
    invitation.expiresAt < new Date()
  ) {
    return;
  }

  if (invitation.email !== email) {
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        firstName,
        lastName,
        role: invitation.role,
        isActive: true,
        workspaceId: invitation.workspaceId,
      },
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: invitation.role,
        isActive: true,
        workspaceId: invitation.workspaceId,
      },
    });
  }

  await prisma.workspaceInvitation.update({
    where: {
      id: invitation.id,
    },
    data: {
      acceptedAt: new Date(),
    },
  });

  redirect("/sign-in");
}
