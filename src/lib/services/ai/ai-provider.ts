import type { AiStream } from "./streaming/ai-stream";
import { TextStream } from "./streaming/text-stream";

export interface AiProvider {
  readonly providerName: string;
  readonly mode: "mock" | "production";

  generateNarrative(prompt: string): Promise<string>;

  generateNarrativeStream(prompt: string): Promise<AiStream>;
}

export class MockAiProvider implements AiProvider {
  readonly providerName = "Vellum Executive Advisor";
  readonly mode = "mock" as const;

  async generateNarrative(_prompt: string): Promise<string> {
    return [
      "Your business is performing well overall.",
      "",
      "Cash collection requires attention today, with one outstanding invoice ready for follow-up.",
      "",
      "Client engagement and booking health remain strong.",
      "",
      "Recommended focus: recover outstanding revenue while keeping today's schedule on track.",
    ].join("\n");
  }

  async generateNarrativeStream(prompt: string): Promise<AiStream> {
    const narrative = await this.generateNarrative(prompt);

    return new TextStream(narrative);
  }
}
