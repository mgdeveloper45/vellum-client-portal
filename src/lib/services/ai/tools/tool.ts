import type { ToolId } from "./tool-id";

export interface AiTool<Input = unknown, Output = unknown> {
  readonly id: ToolId;

  execute(input: Input): Promise<Output>;
}
