import type { AiTool } from "./tool";
import type { ToolId } from "./tool-id";

export class ToolRegistry {
  private readonly tools = new Map<ToolId, AiTool>();

  register(tool: AiTool): void {
    this.tools.set(tool.id, tool);
  }

  resolve(id: ToolId): AiTool | undefined {
    return this.tools.get(id);
  }
}
