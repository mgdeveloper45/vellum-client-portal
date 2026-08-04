export type AuditEntity =
  "PROJECT" | "CLIENT" | "BOOKING" | "DEPOSIT" | "PAYMENT" | "INVOICE";

export interface AuditEntry {
  entity: AuditEntity;
  entityId: string;
  action: string;
  performedBy: string;
  occurredAt: Date;
  details: Record<string, unknown>;
}
