import { describe, expect, it } from "vitest";

import { MockAiProvider } from "../ai-provider";

describe("MockAiProvider", () => {
  it("streams a narrative", async () => {
    const provider = new MockAiProvider();

    const stream = await provider.generateNarrativeStream("Hello");

    let output = "";

    for await (const chunk of stream.stream()) {
      output += chunk.content;
    }

    expect(output.length).toBeGreaterThan(0);
  });
});
