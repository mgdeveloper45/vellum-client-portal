import type { ToolId } from "./tool-id";
import { ToolRegistry } from "./tool-registry";

export async function executeTool<Input, Output>(
  registry: ToolRegistry,
  toolId: ToolId,
  input: Input,
): Promise<Output> {
  const tool = registry.resolve(toolId);

  if (!tool) {
    throw new Error(`No tool registered for ${toolId}.`);
  }

  return tool.execute(input) as Promise<Output>;
}
