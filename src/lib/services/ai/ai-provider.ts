export interface AiProvider {
  readonly providerName: string;
  readonly mode: "mock" | "production";

  generateNarrative(prompt: string): Promise<string>;
}

export class MockAiProvider implements AiProvider {
  readonly providerName = "Mock AI";
  readonly mode = "mock" as const;

  async generateNarrative(prompt: string): Promise<string> {
    return `[Mock AI]\n\n${prompt}`;
  }
}
