import { askWithPrompt } from "../ai-service";

import type { AiActionResult } from "./action-types";

export interface EmailActionParams {
  title: string;

  prompt: string;
}

export async function generateEmailAction(
  params: EmailActionParams,
): Promise<AiActionResult> {
  const content = await askWithPrompt(params.prompt);

  return {
    type: "EMAIL",

    title: params.title,

    preview: content.length > 180 ? `${content.slice(0, 180)}...` : content,

    content,
  };
}
