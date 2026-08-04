import type { AuditEntry } from "./audit-entry";

const entries: AuditEntry[] = [];

export async function recordAuditEntry(
  entry: AuditEntry,
): Promise<void> {
  entries.push(entry);

  // Future:
  // Persist to Prisma
}