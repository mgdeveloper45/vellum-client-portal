"use server";

import { auth } from "@/auth";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { buildProjectAiContext } from "@/lib/services/ai/projects/project-ai-context-builder";
import { generateProjectStatusService } from "@/lib/services/projects/ai/generate-project-status-service";
import { generateProjectSummaryService } from "@/lib/services/projects/ai/generate-project-summary-service";
import { getProjectAiContextService } from "@/lib/services/projects/composition/project-services";

export type GenerateProjectAiResult =
  | {
      success: true;
      content: string;
    }
  | {
      success: false;
      error: string;
    };

export async function generateProjectSummaryAction(
  projectId: string,
): Promise<GenerateProjectAiResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return {
      success: false,
      error: "Workspace not found.",
    };
  }

  const project = await getProjectAiContextService.execute({
    workspaceId,
    projectId,
  });

  if (!project) {
    return {
      success: false,
      error: "Project not found.",
    };
  }

  const context = buildProjectAiContext(project);

  try {
    const content = await generateProjectSummaryService.generate({
      projectName: context.projectName,
      clientName: context.clientName,
      projectDescription: context.projectDescription,
      projectStatus: context.projectStatus,
      completedMilestones: context.completedMilestones,
      outstandingMilestones: context.outstandingMilestones,
      totalInvoiced: context.totalInvoiced,
      totalPaid: context.totalPaid,
      outstandingAmount: context.outstandingAmount,
      risks: context.risks,
    });

    return {
      success: true,
      content,
    };
  } catch {
    return {
      success: false,
      error: "Unable to generate project summary.",
    };
  }
}

export async function generateProjectStatusAction(
  projectId: string,
): Promise<GenerateProjectAiResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return {
      success: false,
      error: "Workspace not found.",
    };
  }

  const project = await getProjectAiContextService.execute({
    workspaceId,
    projectId,
  });

  if (!project) {
    return {
      success: false,
      error: "Project not found.",
    };
  }

  const context = buildProjectAiContext(project);

  try {
    const content = await generateProjectStatusService.generate({
      projectName: context.projectName,
      projectStatus: context.projectStatus,
      completedMilestones: context.completedMilestoneCount,
      totalMilestones: context.totalMilestones,
      totalInvoiced: context.totalInvoiced,
      outstandingAmount: context.outstandingAmount,
      overdueMilestones: context.overdueMilestones,
    });

    return {
      success: true,
      content,
    };
  } catch {
    return {
      success: false,
      error: "Unable to generate project status.",
    };
  }
}
