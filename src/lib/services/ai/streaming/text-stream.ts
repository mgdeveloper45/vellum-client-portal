import type { AiStream, AiStreamChunk } from "./ai-stream";

export class TextStream implements AiStream {
  constructor(
    private readonly text: string,
    private readonly chunkSize = 24,
  ) {}

  async *stream(): AsyncIterable<AiStreamChunk> {
    for (let index = 0; index < this.text.length; index += this.chunkSize) {
      yield {
        content: this.text.slice(index, index + this.chunkSize),
        done: false,
      };
    }

    yield {
      content: "",
      done: true,
    };
  }
}
