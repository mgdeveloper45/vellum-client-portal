import { describe, expect, it } from "vitest";

import { TextStream } from "../text-stream";

describe("TextStream", () => {
  it("streams text in chunks", async () => {
    const stream = new TextStream("Hello World", 5);

    const received: string[] = [];

    for await (const chunk of stream.stream()) {
      if (!chunk.done) {
        received.push(chunk.content);
      }
    }

    expect(received).toEqual(["Hello", " Worl", "d"]);
  });

  it("marks the final chunk", async () => {
    const stream = new TextStream("Hi", 10);

    let lastDone = false;

    for await (const chunk of stream.stream()) {
      lastDone = chunk.done;
    }

    expect(lastDone).toBe(true);
  });
});
