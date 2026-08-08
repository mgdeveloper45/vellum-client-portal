export interface AiStreamChunk {
  content: string;

  done: boolean;
}

export interface AiStream {
  stream(): AsyncIterable<AiStreamChunk>;
}
