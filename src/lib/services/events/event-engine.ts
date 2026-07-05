import type { WorkspaceEvent } from "./workspace-events";

export function sortWorkspaceEvents(
  events: WorkspaceEvent[],
): WorkspaceEvent[] {
  return [...events].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export function getLatestWorkspaceEvent(
  events: WorkspaceEvent[],
): WorkspaceEvent | null {
  if (events.length === 0) {
    return null;
  }

  return sortWorkspaceEvents(events)[0];
}

export function groupWorkspaceEventsByDay(events: WorkspaceEvent[]) {
  return sortWorkspaceEvents(events).reduce<Record<string, WorkspaceEvent[]>>(
    (groups, event) => {
      const key = event.createdAt.toLocaleDateString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(event);

      return groups;
    },
    {},
  );
}
