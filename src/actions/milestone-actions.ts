"use server";

import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import {
  createMilestoneService,
  cycleMilestoneStatusService,
  deleteMilestoneService,
} from "@/lib/services/milestone/composition/milestone-services";
import {
  createMilestoneSchema,
  milestoneMutationSchema,
} from "@/lib/validation/milestone";
import { redirect } from "next/navigation";

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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await createMilestoneService.execute({
    projectId: input.projectId,
    workspaceId,
    title: input.title,
    dueDate: input.dueDate ?? null,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "MILESTONE_CREATED",
    entity: "MILESTONE",
    entityId: result.milestone.id,
    userId: session.user.id,
    metadata: {
      projectId: result.milestone.projectId,
      title: result.milestone.title,
      status: result.milestone.status,
      dueDate: result.milestone.dueDate?.toISOString() ?? null,
    },
  });

  redirect(`/projects/${result.milestone.projectId}`);
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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await cycleMilestoneStatusService.execute({
    milestoneId: input.milestoneId,
    projectId: input.projectId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "MILESTONE_STATUS_CHANGED",
    entity: "MILESTONE",
    entityId: result.milestone.id,
    userId: session.user.id,
    metadata: {
      projectId: result.milestone.projectId,
      previousStatus: result.previousStatus,
      status: result.milestone.status,
    },
  });

  redirect(`/projects/${result.milestone.projectId}`);
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

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await deleteMilestoneService.execute({
    milestoneId: input.milestoneId,
    projectId: input.projectId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  await createAuditLog({
    action: "MILESTONE_DELETED",
    entity: "MILESTONE",
    entityId: result.milestone.id,
    userId: session.user.id,
    metadata: {
      projectId: result.milestone.projectId,
      title: result.milestone.title,
      status: result.milestone.status,
      dueDate: result.milestone.dueDate?.toISOString() ?? null,
    },
  });

  redirect(`/projects/${result.milestone.projectId}`);
}
