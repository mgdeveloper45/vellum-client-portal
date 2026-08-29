import { describe, expect, it, vi } from "vitest";
import { createRecordDepositPaymentService } from "../record-deposit-payment-service";
import { createUpdateDepositPaymentService } from "../update-deposit-payment-service";

function createDepositPaymentRepository() {
  return {
    recordAndSynchronize: vi.fn(),
    updateAndSynchronize: vi.fn(),
    findForEdit: vi.fn(),
    listByDeposit: vi.fn(),
    listByProject: vi.fn(),
    update: vi.fn(),
  };
}

describe("deposit payment status synchronization", () => {
  it("records a partial payment through the atomic repository operation", async () => {
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.recordAndSynchronize.mockResolvedValue({
      success: true,
      paymentId: "payment-1",
    });

    const service = createRecordDepositPaymentService({
      depositPaymentRepository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
      depositId: "deposit-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(result).toEqual({
      success: true,
      paymentId: "payment-1",
    });

    expect(
      depositPaymentRepository.recordAndSynchronize,
    ).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
      depositId: "deposit-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });
  });

  it("records a full payment through the atomic repository operation", async () => {
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.recordAndSynchronize.mockResolvedValue({
      success: true,
      paymentId: "payment-1",
    });

    const service = createRecordDepositPaymentService({
      depositPaymentRepository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "Paid in full",
    });

    expect(result).toEqual({
      success: true,
      paymentId: "payment-1",
    });

    expect(
      depositPaymentRepository.recordAndSynchronize,
    ).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "Paid in full",
    });
  });

  it("updates a payment downward through the atomic repository operation", async () => {
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.updateAndSynchronize.mockResolvedValue({
      success: true,
    });

    const service = createUpdateDepositPaymentService({
      depositPaymentRepository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      paymentId: "payment-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(result).toEqual({
      success: true,
    });

    expect(
      depositPaymentRepository.updateAndSynchronize,
    ).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      paymentId: "payment-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });
  });

  it("updates a payment upward through the atomic repository operation", async () => {
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.updateAndSynchronize.mockResolvedValue({
      success: true,
    });

    const service = createUpdateDepositPaymentService({
      depositPaymentRepository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      paymentId: "payment-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(result).toEqual({
      success: true,
    });

    expect(
      depositPaymentRepository.updateAndSynchronize,
    ).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      paymentId: "payment-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });
  });

  it("returns an idempotency conflict when an operation key is reused incorrectly", async () => {
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.recordAndSynchronize.mockResolvedValue({
      success: false,
      reason: "IDEMPOTENCY_CONFLICT",
    });

    const service = createRecordDepositPaymentService({
      depositPaymentRepository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "Paid in full",
    });

    expect(result).toEqual({
      success: false,
      reason: "IDEMPOTENCY_CONFLICT",
      message: "This payment operation conflicts with an existing payment.",
    });
  });

  it("returns NOT_FOUND when the atomic record operation cannot find the deposit", async () => {
    const depositPaymentRepository = createDepositPaymentRepository();

    depositPaymentRepository.recordAndSynchronize.mockResolvedValue({
      success: false,
      reason: "NOT_FOUND",
    });

    const service = createRecordDepositPaymentService({
      depositPaymentRepository,
    });

    const result = await service({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
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

    expect(
      depositPaymentRepository.recordAndSynchronize,
    ).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
      depositId: "missing-deposit",
      amount: 50,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });
  });
});
