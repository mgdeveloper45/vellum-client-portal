export interface AiActionCard {
  title: string;

  subtitle?: string;

  content: string;

  actions: string[];

  metadata: Record<string, unknown>;
}
