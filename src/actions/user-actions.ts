"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createUserAction(formData: FormData) {
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const email = String(formData.get("email"));
  const role = String(formData.get("role")) as "ADMIN" | "CLIENT";
  const password = String(formData.get("password"));

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
      isActive: true,
    },
  });

  redirect("/users");
}

export async function updateUserAction(formData: FormData) {
  const userId = String(formData.get("userId"));
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const email = String(formData.get("email"));
  const role = String(formData.get("role")) as "ADMIN" | "CLIENT";
  const isActive = formData.get("isActive") === "on";

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      firstName,
      lastName,
      email,
      role,
      isActive,
    },
  });

  redirect("/users");
}
