"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Creates a new client user.
 * Temporary password is used for development until invite emails are added.
 */
export async function createClientAction(formData: FormData) {
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const email = String(formData.get("email"));
  const notes = String(formData.get("notes") || "");

  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      notes,
      password: hashedPassword,
      role: "CLIENT",
    },
  });

  redirect("/clients");
}