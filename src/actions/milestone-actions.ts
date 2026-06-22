"use server";

import { auth } from "@/auth";
import { canManageProjects } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createMilestoneAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const projectId = String(formData.get("projectId"));
  const title = String(formData.get("title"));
  const dueDateValue = String(formData.get("dueDate") || "");

  await prisma.milestone.create({
    data: {
      projectId,
      title,
      status: "PENDING",
      dueDate: dueDateValue ? new Date(dueDateValue) : null,
    },
  });

  redirect(`/projects/${projectId}`);
}

export async function cycleMilestoneStatusAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const milestoneId = String(formData.get("milestoneId"));
  const projectId = String(formData.get("projectId"));

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
  });

  if (!milestone) {
    return;
  }

  const nextStatus =
    milestone.status === "PENDING"
      ? "IN_PROGRESS"
      : milestone.status === "IN_PROGRESS"
        ? "COMPLETE"
        : "PENDING";

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: nextStatus },
  });

  redirect(`/projects/${projectId}`);
}

export async function deleteMilestoneAction(formData: FormData) {
  const session = await auth();

  if (!canManageProjects(session?.user?.role)) {
    return;
  }

  const milestoneId = String(formData.get("milestoneId"));

  const projectId = String(formData.get("projectId"));

  await prisma.milestone.delete({
    where: {
      id: milestoneId,
    },
  });

  redirect(`/projects/${projectId}`);
}
