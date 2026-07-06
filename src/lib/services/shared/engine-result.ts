import type { Recommendation } from "../intelligence/recommendation";

export type EngineHealth = {
  score: number;
  status: string;
};

export type EngineResult<T> = {
  data: T;
  recommendations: Recommendation[];
  health?: EngineHealth;
  summary?: string;
};
