"use server";

import { redirect } from "next/navigation";

import { passwordResetService } from "@/lib/services/password-reset/composition/password-reset-services";

export type PasswordResetState = {
  error?: string;
  success?: string;
  resetUrl?: string;
};

export async function requestPasswordResetAction(
  _prevState: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return {
      error: "Email is required.",
    };
  }

  await passwordResetService.requestReset(email);

  return {
    success: "If an account exists for that email, a reset link has been sent.",
  };
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (!token) {
    throw new Error("Reset token is required.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  if (newPassword.length < 12) {
    throw new Error("Password must be at least 12 characters.");
  }

  await passwordResetService.resetPassword(token, newPassword);

  redirect("/sign-in");
}
