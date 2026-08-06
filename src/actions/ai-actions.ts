"use server";

import { auth } from "@/auth";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { askWorkspaceAI } from "@/lib/services/ai/ai-service";
import { getWorkspaceAIContext } from "@/lib/services/ai/workspace-context";


export async function getWorkspaceSummaryAction() {
  const session = await auth();

  if (!session?.user) {
    return "Please sign in.";
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return "Workspace not found.";
  }

  const context = await getWorkspaceAIContext({
    userId: session.user.id,
    workspaceId,
  });

  return askWorkspaceAI(context);
}
