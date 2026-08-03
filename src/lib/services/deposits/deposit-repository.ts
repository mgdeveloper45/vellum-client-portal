export type DepositStatus =
  "REQUESTED" | "PARTIALLY_PAID" | "PAID" | "REFUNDED" | "CANCELLED";

export type PaymentMethod =
  "CASH" | "CHECK" | "ACH" | "CREDIT_CARD" | "BANK_TRANSFER" | "OTHER";

export interface DepositSummaryRecord {
  id: string;

  amount: number;

  status: DepositStatus;

  projectId: string;

  dueDate: Date | null;

  requestedAt: Date;

  paidAt: Date | null;
}

export interface CreateDepositRecordInput {
  projectId: string;

  amount: number;

  dueDate: Date | null;

  notes: string;

  status: DepositStatus;
}

export interface UpdateDepositRecordInput {
  depositId: string;

  amount: number;

  dueDate: Date | null;

  notes: string;

  status: DepositStatus;

  paymentMethod: PaymentMethod | null;

  paidAt: Date | null;
}

export interface FindDepositInput {
  workspaceId: string;
  depositId: string;
}

export interface DepositEditRecord {
  id: string;

  projectId: string;

  amount: number;

  status: DepositStatus;

  dueDate: Date | null;

  notes: string;

  paymentMethod: PaymentMethod | null;

  paidAt: Date | null;
}
export interface MarkDepositPaidInput {
  workspaceId: string;

  depositId: string;
}
export interface DepositRepository {
  create(input: CreateDepositRecordInput): Promise<{
    id: string;
  }>;

  update(input: UpdateDepositRecordInput): Promise<boolean>;

  markPaid(input: MarkDepositPaidInput): Promise<boolean>;

  findForEdit(input: FindDepositInput): Promise<DepositEditRecord | null>;

  listByProject(projectId: string): Promise<DepositSummaryRecord[]>;
}
