import { MockAiProvider, type AiProvider } from "./ai-provider";
import { OpenAiProvider } from "./openai-provider";

export function createAiProvider(): AiProvider {
  if (process.env.AI_MOCK_MODE === "true") {
    return new MockAiProvider();
  }

  if (!process.env.OPENAI_API_KEY) {
    return new MockAiProvider();
  }

  return new OpenAiProvider();
}
