
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

export interface DepositRepository {
  create(input: CreateDepositRecordInput): Promise<{
    id: string;
  }>;

  update(input: UpdateDepositRecordInput): Promise<boolean>;

  listByProject(projectId: string): Promise<DepositSummaryRecord[]>;
}
