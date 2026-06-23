"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createDefaultWorkspaceAction() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return;
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: "Vellum Workspace",
    },
  });

  await prisma.user.updateMany({
    data: {
      workspaceId: workspace.id,
    },
  });

  await prisma.project.updateMany({
    data: {
      workspaceId: workspace.id,
    },
  });

  redirect("/settings");
}
