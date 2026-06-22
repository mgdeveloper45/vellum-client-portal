"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { sendPasswordResetEmail } from "@/lib/email";

export type PasswordResetState = {
  error?: string;
  success?: string;
  resetUrl?: string;
};

export async function requestPasswordResetAction(
  _prevState: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const email = String(formData.get("email")).trim();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success:
        "If an account exists for that email, a reset link has been created.",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  await sendPasswordResetEmail({
    email: user.email,
    resetUrl,
  });

  return {
    success: "If an account exists for that email, a reset link has been sent.",
  };
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token"));
  const newPassword = String(formData.get("newPassword")).trim();
  const confirmPassword = String(formData.get("confirmPassword")).trim();

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  if (newPassword.length < 12) {
    throw new Error("Password must be at least 12 characters.");
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    throw new Error("Reset link is invalid or expired.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  redirect("/sign-in");
}
