"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createMilestoneAction(formData: FormData) {
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

export async function deleteMilestoneAction(
  formData: FormData
) {
  const milestoneId = String(
    formData.get("milestoneId")
  );

  const projectId = String(
    formData.get("projectId")
  );

  await prisma.milestone.delete({
    where: {
      id: milestoneId,
    },
  });

  redirect(`/projects/${projectId}`);
}