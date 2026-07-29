import type { AiResult } from "./ai-result";
import { getExecutiveBrief, saveExecutiveBrief } from "./executive-brief-cache";
import { createAiProvider } from "./ai-provider-factory";
import { DashboardContext } from "../dashboard/dashboard-context";
import { ExecutiveNarrativeService } from "./executive-narrative-service";

type GetOrCreateExecutiveBriefInput = {
  workspaceId: string;
  dashboardContext: DashboardContext;
};

export async function getOrCreateExecutiveBrief({
  workspaceId,
  dashboardContext,
}: GetOrCreateExecutiveBriefInput): Promise<AiResult> {
  const cachedBrief = await getExecutiveBrief(workspaceId);

  if (cachedBrief) {
    return {
      narrative: cachedBrief.narrative,
      provider: cachedBrief.provider,
      durationMs: cachedBrief.durationMs,
      mode: cachedBrief.mode,
    };
  }

  const provider = createAiProvider();
  const narrativeService = new ExecutiveNarrativeService(provider);
  const result = await narrativeService.generate(dashboardContext);
  await saveExecutiveBrief(workspaceId, result);
  return result;
}
