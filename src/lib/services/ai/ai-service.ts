import { createAiProvider } from "./ai-provider-factory";
import { analyzeWorkspace } from "./business-insights";
import {
  buildCopilotPrompt,
  buildWorkspaceSummaryPrompt,
} from "./prompt-builder";

import type { BusinessContext } from "./conversation/business-context";

type WorkspaceAIContext = Parameters<typeof analyzeWorkspace>[0];

const provider = createAiProvider();

export async function askWorkspaceAI(
  context: WorkspaceAIContext,
): Promise<string> {
  const prompt = buildWorkspaceSummaryPrompt(context);

  return provider.generateNarrative(prompt);
}

export async function askWithPrompt(
  prompt: string,
): Promise<string> {
  return provider.generateNarrative(prompt);
}

export async function askCopilot(
  context: BusinessContext,
  question: string,
): Promise<string> {
  const prompt = buildCopilotPrompt(context, question);

  return provider.generateNarrative(prompt);
}
