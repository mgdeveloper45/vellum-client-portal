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
export interface RecordAndSynchronizeDepositPaymentInput {
  workspaceId: string;
  depositId: string;
  operationKey: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
}

export type RecordAndSynchronizeDepositPaymentResult =
  | {
      success: true;
      paymentId: string;
    }
  | {
      success: false;
      reason: "NOT_FOUND" | "IDEMPOTENCY_CONFLICT";
    };

export interface UpdateAndSynchronizeDepositPaymentInput {
  workspaceId: string;
  paymentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
}

export type UpdateAndSynchronizeDepositPaymentResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: "NOT_FOUND";
    };

export interface DepositPaymentRepository {
  recordAndSynchronize(
    input: RecordAndSynchronizeDepositPaymentInput,
  ): Promise<RecordAndSynchronizeDepositPaymentResult>;
  updateAndSynchronize(
    input: UpdateAndSynchronizeDepositPaymentInput,
  ): Promise<UpdateAndSynchronizeDepositPaymentResult>;

  findForEdit(input: {
    workspaceId: string;
    paymentId: string;
  }): Promise<DepositPaymentEditRecord | null>;

  listByDeposit(depositId: string): Promise<DepositPaymentRecord[]>;

  listByProject(projectId: string): Promise<DepositPaymentRecord[]>;

  update(input: UpdateDepositPaymentInput & {
    workspaceId: string;
  }): Promise<boolean>;
  
}
