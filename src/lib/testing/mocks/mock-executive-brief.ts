import { vi } from "vitest";

export const getOrCreateExecutiveBrief = vi.fn().mockResolvedValue({
  narrative: "Executive dashboard summary.",
  provider: "test",
  durationMs: 1,
  mode: "mock",
});

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief,
}));
