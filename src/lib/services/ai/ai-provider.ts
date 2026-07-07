export type AiProvider = {
  generateNarrative(prompt: string): Promise<string>;
};

export class MockAiProvider implements AiProvider {
  async generateNarrative(prompt: string): Promise<string> {
    return Promise.resolve(`[Mock AI]\n\n${prompt}`);
  }
}
