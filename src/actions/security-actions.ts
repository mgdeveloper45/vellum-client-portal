"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { changePasswordService } from "@/lib/services/security/composition/security-services";

export type ChangePasswordState = {
  error?: string;
  success?: string;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "You must be signed in.",
    };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "").trim();

  const newPassword = String(formData.get("newPassword") ?? "").trim();

  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (newPassword.length < 12) {
    return {
      error: "Password must be at least 12 characters.",
    };
  }

  if (newPassword.length > 128) {
    return {
      error: "Password is too long.",
    };
  }

  if (!/[A-Z]/.test(newPassword)) {
    return {
      error: "Password must contain at least one uppercase letter.",
    };
  }

  if (!/[a-z]/.test(newPassword)) {
    return {
      error: "Password must contain at least one lowercase letter.",
    };
  }

  if (!/[0-9]/.test(newPassword)) {
    return {
      error: "Password must contain at least one number.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      error: "New passwords do not match.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      error: "New password must be different from your current password.",
    };
  }

  const result = await changePasswordService.execute({
    userId: session.user.id,
    currentPassword,
    newPassword,
  });

  if (!result.success) {
    if (result.error === "USER_NOT_FOUND") {
      return {
        error: "User not found.",
      };
    }

    if (result.error === "PASSWORD_NOT_SET") {
      return {
        error: "Password is not set for this account.",
      };
    }

    return {
      error: "Current password is incorrect.",
    };
  }

  await createAuditLog({
    action: "PASSWORD_CHANGED",
    entity: "USER",
    entityId: session.user.id,
    userId: session.user.id,
  });

  return {
    success: "Password updated successfully.",
  };
}
