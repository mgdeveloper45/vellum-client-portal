import { openai } from "@/lib/openai";
import type { AiProvider } from "./ai-provider";

export class OpenAiProvider implements AiProvider {
  readonly providerName = "OpenAI";
  readonly mode = "production" as const;

  async generateNarrative(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Vellum's executive business advisor. Write concise, practical executive briefings.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    return (
      response.choices[0]?.message?.content ??
      "No executive narrative was generated."
    );
  }
}
