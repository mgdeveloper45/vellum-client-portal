import type { DashboardContext } from "@/lib/services/dashboard/dashboard-context";
import type { AiProvider } from "./ai-provider";
import type { AiResult } from "./ai-result";
import { buildExecutivePrompt } from "./executive-prompt";

export class ExecutiveNarrativeService {
  constructor(private readonly provider: AiProvider) {}

  async generate(context: DashboardContext): Promise<AiResult> {
    const prompt = buildExecutivePrompt(context);

    const started = Date.now();

    const narrative = await this.provider.generateNarrative(prompt);

    return {
      narrative,
      provider: this.provider.providerName,
      durationMs: Date.now() - started,
      mode: this.provider.mode,
    };
  }
}
