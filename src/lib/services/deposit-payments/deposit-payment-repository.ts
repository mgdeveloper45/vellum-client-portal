export type PaymentMethod =
  "CASH" | "CHECK" | "ACH" | "CREDIT_CARD" | "BANK_TRANSFER" | "OTHER";

export interface DepositPaymentRecord {
  id: string;
  depositId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  receivedAt: Date;
  notes: string;
}

export interface RecordDepositPaymentInput {
  depositId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface DepositPaymentEditRecord {
  id: string;
  depositId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  receivedAt: Date;
  notes: string;
}

export interface UpdateDepositPaymentInput {
  paymentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
}
export interface DepositPaymentRepository {
  create(input: RecordDepositPaymentInput): Promise<{
    id: string;
  }>;
  findForEdit(paymentId: string): Promise<DepositPaymentEditRecord | null>;
  
  listByDeposit(depositId: string): Promise<DepositPaymentRecord[]>;

  listByProject(projectId: string): Promise<DepositPaymentRecord[]>;

  update(input: UpdateDepositPaymentInput): Promise<boolean>;
  
}
