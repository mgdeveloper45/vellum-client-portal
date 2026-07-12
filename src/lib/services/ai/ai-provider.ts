export interface AiProvider {
  readonly providerName: string;
  readonly mode: "mock" | "production";

  generateNarrative(prompt: string): Promise<string>;
}

export class MockAiProvider implements AiProvider {
  readonly providerName = "Vellum Executive Advisor";
  readonly mode = "mock" as const;

  async generateNarrative(): Promise<string> {
    return [
      "Your business is performing well overall.",
      "",
      "Cash collection requires attention today, with one outstanding invoice ready for follow-up.",
      "",
      "Client engagement and booking health remain strong.",
      "",
      "Recommended focus: recover outstanding revenue while keeping today’s schedule on track.",
    ].join("\n");
  }
}
