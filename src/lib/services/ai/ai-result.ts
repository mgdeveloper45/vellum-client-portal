export type AiResult = {
  narrative: string;
  provider: string;
  durationMs: number;
  mode: "mock" | "production";
};
