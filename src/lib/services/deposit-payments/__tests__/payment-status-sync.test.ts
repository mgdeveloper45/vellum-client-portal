import { describe, expect, it, vi } from "vitest";
import { createRecordDepositPaymentService } from "../record-deposit-payment-service";
import { createUpdateDepositPaymentService } from "../update-deposit-payment-service";

function createDepositRepository() {
  return {
    create: vi.fn(),
    findFinancialRecord: vi.fn(),
    updateStatus: vi.fn(),
    update: vi.fn(),
    markPaid: vi.fn(),
    findForEdit: vi.fn(),
    listByProject: vi.fn(),
  };
}

function createDepositPaymentRepository() {
  return {
    create: vi.fn(),
    findForEdit: vi.fn(),
    listByDeposit: vi.fn(),
    listByProject: vi.fn(),
    update: vi.fn(),
  };
}

describe("deposit payment status synchronization", () => {
  it("marks a deposit PARTIALLY_PAID after recording a partial payment", async () => {
    const depositRepository = createDepositRepository();
    const depositPaymentRepository = createDepositPaymentRepository();

    depositRepository.findFinancialRecord.mockResolvedValue({
      id: "deposit-1",
      amount: 100,
      status: "REQUESTED",
    });

    depositPaymentRepository.create.mockResolvedValue({
      id: "payment-1",
    });

    depositPaymentRepository.listByDeposit.mockResolvedValue([
      {
        id: "payment-1",
        depositId: "deposit-1",
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        receivedAt: new Date(),
        notes: "",
      },
    ]);

    depositRepository.updateStatus.mockResolvedValue(true);

    const service = createRecordDepositPaymentService({
      depositRepository,
      depositPaymentRepository,
    });

    const result = await service({
      depositId: "deposit-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(result).toEqual({
      success: true,
      paymentId: "payment-1",
    });

    expect(depositRepository.updateStatus).toHaveBeenCalledWith(
      "deposit-1",
      "PARTIALLY_PAID",
    );
  });

  it("marks a deposit PAID after recording payment in full", async () => {
    const depositRepository = createDepositRepository();
    const depositPaymentRepository = createDepositPaymentRepository();

    depositRepository.findFinancialRecord.mockResolvedValue({
      id: "deposit-1",
      amount: 100,
      status: "REQUESTED",
    });

    depositPaymentRepository.create.mockResolvedValue({
      id: "payment-1",
    });

    depositPaymentRepository.listByDeposit.mockResolvedValue([
      {
        id: "payment-1",
        depositId: "deposit-1",
        amount: 100,
        paymentMethod: "CREDIT_CARD",
        receivedAt: new Date(),
        notes: "",
      },
    ]);

    depositRepository.updateStatus.mockResolvedValue(true);

    const service = createRecordDepositPaymentService({
      depositRepository,
      depositPaymentRepository,
    });

    await service({
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(depositRepository.updateStatus).toHaveBeenCalledWith(
      "deposit-1",
      "PAID",
    );
  });

  it("recalculates deposit status after editing a payment downward", async () => {
    const depositRepository = createDepositRepository();
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.findForEdit.mockResolvedValue({
      id: "payment-1",
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      receivedAt: new Date(),
      notes: "",
    });

    depositPaymentRepository.update.mockResolvedValue(true);

    depositRepository.findFinancialRecord.mockResolvedValue({
      id: "deposit-1",
      amount: 100,
      status: "PAID",
    });

    depositPaymentRepository.listByDeposit.mockResolvedValue([
      {
        id: "payment-1",
        depositId: "deposit-1",
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        receivedAt: new Date(),
        notes: "",
      },
    ]);

    depositRepository.updateStatus.mockResolvedValue(true);

    const service = createUpdateDepositPaymentService({
      depositRepository,
      depositPaymentRepository,
    });

    const result = await service({
      paymentId: "payment-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(result).toEqual({
      success: true,
    });

    expect(depositRepository.updateStatus).toHaveBeenCalledWith(
      "deposit-1",
      "PARTIALLY_PAID",
    );
  });

  it("recalculates deposit status after editing a payment upward to full payment", async () => {
    const depositRepository = createDepositRepository();
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.findForEdit.mockResolvedValue({
      id: "payment-1",
      depositId: "deposit-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      receivedAt: new Date(),
      notes: "",
    });

    depositPaymentRepository.update.mockResolvedValue(true);

    depositRepository.findFinancialRecord.mockResolvedValue({
      id: "deposit-1",
      amount: 100,
      status: "PARTIALLY_PAID",
    });

    depositPaymentRepository.listByDeposit.mockResolvedValue([
      {
        id: "payment-1",
        depositId: "deposit-1",
        amount: 100,
        paymentMethod: "CREDIT_CARD",
        receivedAt: new Date(),
        notes: "",
      },
    ]);

    depositRepository.updateStatus.mockResolvedValue(true);

    const service = createUpdateDepositPaymentService({
      depositRepository,
      depositPaymentRepository,
    });

    await service({
      paymentId: "payment-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(depositRepository.updateStatus).toHaveBeenCalledWith(
      "deposit-1",
      "PAID",
    );
  });

  it("does not create a payment when the deposit does not exist", async () => {
    const depositRepository = createDepositRepository();
    const depositPaymentRepository = createDepositPaymentRepository();

    depositRepository.findFinancialRecord.mockResolvedValue(null);

    const service = createRecordDepositPaymentService({
      depositRepository,
      depositPaymentRepository,
    });

    const result = await service({
      depositId: "missing-deposit",
      amount: 50,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(result).toEqual({
      success: false,
      reason: "NOT_FOUND",
      message: "Deposit not found.",
    });

    expect(depositPaymentRepository.create).not.toHaveBeenCalled();
  });
});
