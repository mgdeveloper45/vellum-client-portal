"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProjects } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createMilestoneSchema,
  milestoneMutationSchema,
} from "@/lib/validation/milestone";
import { redirect } from "next/navigation";

async function getWorkspaceId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
    },
  });

  return user?.workspaceId;
}

export async function createMilestoneAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const input = createMilestoneSchema.parse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    dueDate: formData.get("dueDate"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      workspaceId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return;
  }

  const milestone = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: input.title,
      status: "PENDING",
      dueDate: input.dueDate ? new Date(`${input.dueDate}T00:00:00`) : null,
    },
  });

  await createAuditLog({
    action: "MILESTONE_CREATED",
    entity: "MILESTONE",
    entityId: milestone.id,
    userId: session.user.id,
    metadata: {
      projectId: milestone.projectId,
      title: milestone.title,
      status: milestone.status,
      dueDate: milestone.dueDate?.toISOString() ?? null,
    },
  });

  redirect(`/projects/${project.id}`);
}

export async function cycleMilestoneStatusAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const input = milestoneMutationSchema.parse({
    milestoneId: formData.get("milestoneId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const milestone = await prisma.milestone.findFirst({
    where: {
      id: input.milestoneId,
      projectId: input.projectId,
      project: {
        workspaceId,
      },
    },
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

  const updatedMilestone = await prisma.milestone.update({
    where: {
      id: milestone.id,
    },
    data: {
      status: nextStatus,
    },
  });

  await createAuditLog({
    action: "MILESTONE_STATUS_CHANGED",
    entity: "MILESTONE",
    entityId: updatedMilestone.id,
    userId: session.user.id,
    metadata: {
      projectId: updatedMilestone.projectId,
      previousStatus: milestone.status,
      status: updatedMilestone.status,
    },
  });

  redirect(`/projects/${input.projectId}`);
}

export async function deleteMilestoneAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || !canManageProjects(session.user.role)) {
    return;
  }

  const input = milestoneMutationSchema.parse({
    milestoneId: formData.get("milestoneId"),
    projectId: formData.get("projectId"),
  });

  const workspaceId = await getWorkspaceId(session.user.id);

  if (!workspaceId) {
    return;
  }

  const milestone = await prisma.milestone.findFirst({
    where: {
      id: input.milestoneId,
      projectId: input.projectId,
      project: {
        workspaceId,
      },
    },
    select: {
      id: true,
      title: true,
      status: true,
      dueDate: true,
    },
  });

  if (!milestone) {
    return;
  }

  await prisma.milestone.delete({
    where: {
      id: milestone.id,
    },
  });

  await createAuditLog({
    action: "MILESTONE_DELETED",
    entity: "MILESTONE",
    entityId: milestone.id,
    userId: session.user.id,
    metadata: {
      projectId: input.projectId,
      title: milestone.title,
      status: milestone.status,
      dueDate: milestone.dueDate?.toISOString() ?? null,
    },
  });

  redirect(`/projects/${input.projectId}`);
}
