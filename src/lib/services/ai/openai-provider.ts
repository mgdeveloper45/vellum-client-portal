import { getOpenAIClient } from "@/lib/openai";
import type { AiProvider } from "./ai-provider";
import type { AiStream } from "./streaming/ai-stream";
import { TextStream } from "./streaming/text-stream";

export class OpenAiProvider implements AiProvider {
  readonly providerName = "OpenAI";
  readonly mode = "production" as const;

  async generateNarrative(prompt: string): Promise<string> {
    const response = await getOpenAIClient().responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You are Vellum's executive business advisor. Write concise, practical executive briefings. Never invent business data.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
          ],
        },
      ],
    });

    return response.output_text ?? "No executive narrative was generated.";
  }

  async generateNarrativeStream(prompt: string): Promise<AiStream> {
    const narrative = await this.generateNarrative(prompt);

    return new TextStream(narrative);
  }
}
