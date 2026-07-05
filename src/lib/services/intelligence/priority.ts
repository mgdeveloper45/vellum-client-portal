export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const priorityWeight: Record<Priority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export function sortByPriority<T extends { priority: Priority }>(items: T[]) {
  return [...items].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority],
  );
}
