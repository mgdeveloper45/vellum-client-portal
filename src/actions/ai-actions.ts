"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { askAI } from "@/lib/services/ai/ai-service";
import { getWorkspaceAIContext } from "@/lib/services/ai/workspace-context";
import { buildWorkspaceSummaryPrompt } from "@/lib/services/ai/prompt-builder";

export async function getWorkspaceSummaryAction() {
  const session = await auth();

  if (!session?.user) {
    return "Please sign in.";
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return "Workspace not found.";
  }

  const context = await getWorkspaceAIContext({
    userId: session.user.id,
    workspaceId: currentUser.workspaceId,
  });

  const prompt = buildWorkspaceSummaryPrompt(context);

  return askAI(prompt);
}
