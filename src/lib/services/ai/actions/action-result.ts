export interface AiActionResult {
  success: boolean;

  message: string;

  title?: string;

  content?: string;

  metadata?: Record<string, unknown>;
}
