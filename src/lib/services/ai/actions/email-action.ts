import { askWithPrompt } from "../ai-service";
import type { AiActionResult } from "./action-types";

export interface EmailActionParams {
  prompt: string;
  title: string;
}

export async function generateEmailAction(
  params: EmailActionParams,
): Promise<AiActionResult> {
  const content = await askWithPrompt(params.prompt);

  return {
    title: params.title,
    content,
  };
}
