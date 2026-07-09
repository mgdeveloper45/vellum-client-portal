import { prisma } from "@/lib/prisma";
import type { AiResult } from "./ai-result";

export async function getExecutiveBrief(workspaceId: string) {
  return prisma.executiveBriefCache.findUnique({
    where: {
      workspaceId,
    },
  });
}

export async function saveExecutiveBrief(
  workspaceId: string,
  result: AiResult,
) {
  return prisma.executiveBriefCache.upsert({
    where: {
      workspaceId,
    },
    create: {
      workspaceId,
      narrative: result.narrative,
      provider: result.provider,
      mode: result.mode,
      durationMs: result.durationMs,
    },
    update: {
      narrative: result.narrative,
      provider: result.provider,
      mode: result.mode,
      durationMs: result.durationMs,
    },
  });
}
