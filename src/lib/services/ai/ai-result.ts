import type { ExecutiveBriefMode } from "@/lib/generated/prisma/enums";

export type AiResult = {
  narrative: string;
  provider: string;
  durationMs: number;
  mode: ExecutiveBriefMode;
};
