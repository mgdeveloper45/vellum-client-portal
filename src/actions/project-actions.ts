"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createProjectAction(
  formData: FormData
) {
  const name = String(formData.get("name"));
  const description = String(
    formData.get("description")
  );
  const clientId = String(formData.get("clientId"));
  const ownerId = String(formData.get("ownerId"));
  const status = String(
    formData.get("status")
  ) as "PLANNING" | "ACTIVE" | "REVIEW" | "COMPLETED";

  await prisma.project.create({
    data: {
      name,
      description,
      status,
      ownerId,
      clientId,
    },
  });

  redirect("/projects");
}