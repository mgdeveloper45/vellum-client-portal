import type { DashboardContext } from "@/lib/services/dashboard/dashboard-context";
import { buildExecutivePrompt } from "./executive-prompt";
import type { AiProvider } from "./ai-provider";

export class ExecutiveNarrativeService {
  constructor(private readonly provider: AiProvider) {}

  async generate(context: DashboardContext): Promise<string> {
    const prompt = buildExecutivePrompt(context);

    return this.provider.generateNarrative(prompt);
  }
}
