export type BusinessSignalCategory =
  | "FINANCE"
  | "REVENUE"
  | "BOOKINGS"
  | "PROJECTS"
  | "CLIENTS"
  | "CAPACITY"
  | "WORKSPACE";

export type BusinessSignalSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface BusinessSignal {
  id: string;

  category: BusinessSignalCategory;

  severity: BusinessSignalSeverity;

  title: string;

  description: string;

  recommendation: string;

  /**
   * Estimated business impact.
   * Higher numbers indicate greater financial or operational value.
   */
  impact: number;

  /**
   * Confidence in the recommendation.
   * Range: 0–100
   */
  confidence: number;

  /**
   * How quickly action should be taken.
   * Range: 0–100
   */
  urgency: number;

  metadata?: Record<string, unknown>;
}
