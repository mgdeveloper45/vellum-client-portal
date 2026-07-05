import type { WorkspaceEventType } from "./event-types";

export type WorkspaceEvent = {
  id: string;
  type: WorkspaceEventType;
  title: string;
  description: string;
  createdAt: Date;
};
