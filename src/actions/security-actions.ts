"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Allows a signed-in user to change their own password.
 */
export async function changePasswordAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const currentPassword = String(formData.get("currentPassword"));
  const newPassword = String(formData.get("newPassword"));
  const confirmPassword = String(formData.get("confirmPassword"));

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords do not match.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return;
  }

  const currentPasswordMatches = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!currentPasswordMatches) {
    throw new Error("Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  redirect("/settings");
}
