"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export type ChangePasswordState = {
  error?: string;
  success?: string;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();

  if (!session?.user) {
    return { error: "You must be signed in." };
  }

  const currentPassword = String(formData.get("currentPassword")).trim();
  const newPassword = String(formData.get("newPassword")).trim();
  const confirmPassword = String(formData.get("confirmPassword")).trim();

  if (newPassword.length < 12) {
    return { error: "Password must be at least 12 characters." };
  }

  if (newPassword.length > 128) {
    return { error: "Password is too long." };
  }

  if (!/[A-Z]/.test(newPassword)) {
    return { error: "Password must contain at least one uppercase letter." };
  }

  if (!/[a-z]/.test(newPassword)) {
    return { error: "Password must contain at least one lowercase letter." };
  }

  if (!/[0-9]/.test(newPassword)) {
    return { error: "Password must contain at least one number." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  if (currentPassword === newPassword) {
    return {
      error: "New password must be different from your current password.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found." };
  }

  const currentPasswordMatches = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!currentPasswordMatches) {
    return { error: "Current password is incorrect." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  await createAuditLog({
    action: "PASSWORD_CHANGED",
    entity: "USER",
    entityId: session.user.id,
    userId: session.user.id,
  });

  return { success: "Password updated successfully." };
}
