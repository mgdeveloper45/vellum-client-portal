import type { ExecutiveBrief } from "../ai/executive-brief";
import type { ExecutiveContext } from "../ai/executive-engine";
import type { TimelineEvent } from "../timeline/timeline-types";

export type DashboardContext = {
  executiveContext: ExecutiveContext;
  executiveBrief: ExecutiveBrief;
  timeline: TimelineEvent[];
};
