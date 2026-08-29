import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  depositFindFirstMock,
  depositUpdateMock,
  depositUpdateManyMock,
  depositPaymentCreateManyMock,
  depositPaymentFindUniqueMock,
  depositPaymentAggregateMock,
  depositPaymentTransactionFindFirstMock,
  depositPaymentTransactionUpdateMock,
  depositPaymentFindFirstMock,
  depositPaymentUpdateManyMock,
  notificationCreateMock,
  transactionMock,
} = vi.hoisted(() => ({
  depositFindFirstMock: vi.fn(),
  depositUpdateMock: vi.fn(),
  depositUpdateManyMock: vi.fn(),
  depositPaymentCreateManyMock: vi.fn(),
  depositPaymentFindUniqueMock: vi.fn(),
  depositPaymentAggregateMock: vi.fn(),
  depositPaymentTransactionFindFirstMock: vi.fn(),
  depositPaymentTransactionUpdateMock: vi.fn(),
  depositPaymentFindFirstMock: vi.fn(),
  depositPaymentUpdateManyMock: vi.fn(),
  notificationCreateMock: vi.fn(),
  transactionMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => {
  const transaction = {
    deposit: {
      findFirst: depositFindFirstMock,
      update: depositUpdateMock,
      updateMany: depositUpdateManyMock,
    },
    depositPayment: {
      createMany: depositPaymentCreateManyMock,
      findUnique: depositPaymentFindUniqueMock,
      aggregate: depositPaymentAggregateMock,
      findFirst: depositPaymentTransactionFindFirstMock,
      update: depositPaymentTransactionUpdateMock,
    },
    notification: {
      create: notificationCreateMock,
    },
  };

  transactionMock.mockImplementation(async (callback) => callback(transaction));

  return {
    prisma: {
      $transaction: transactionMock,
      depositPayment: {
        findFirst: depositPaymentFindFirstMock,
        updateMany: depositPaymentUpdateManyMock,
      },
    },
  };
});

import { prismaDepositPaymentRepository } from "../prisma-deposit-payment-repository";

describe("prismaDepositPaymentRepository tenant isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    transactionMock.mockImplementation(async (callback) =>
      callback({
        deposit: {
          findFirst: depositFindFirstMock,
          update: depositUpdateMock,
          updateMany: depositUpdateManyMock,
        },
        depositPayment: {
          createMany: depositPaymentCreateManyMock,
          findUnique: depositPaymentFindUniqueMock,
          aggregate: depositPaymentAggregateMock,
          findFirst: depositPaymentTransactionFindFirstMock,
          update: depositPaymentTransactionUpdateMock,
        },
        notification: {
          create: notificationCreateMock,
        },
      }),
    );
  });

  it("runs record synchronization at Serializable isolation", async () => {
    depositFindFirstMock.mockResolvedValueOnce(null);

    await prismaDepositPaymentRepository.recordAndSynchronize({
      workspaceId: "workspace-1",
      operationKey: "00000000-0000-4000-8000-000000000001",
      depositId: "missing-deposit",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(transactionMock).toHaveBeenCalledWith(
      expect.any(Function),
      {
        isolationLevel: "Serializable",
      },
    );
  });

  it("runs update synchronization at Serializable isolation", async () => {
    depositPaymentTransactionFindFirstMock.mockResolvedValueOnce(null);

    await prismaDepositPaymentRepository.updateAndSynchronize({
      workspaceId: "workspace-1",
      paymentId: "missing-payment",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
    });

    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(transactionMock).toHaveBeenCalledWith(
      expect.any(Function),
      {
        isolationLevel: "Serializable",
      },
    );
  });

  it("retries a P2034 Serializable transaction conflict", async () => {
    const conflict = Object.assign(
      new Error("Transaction write conflict"),
      {
        code: "P2034",
      },
    );

    transactionMock
      .mockRejectedValueOnce(conflict)
      .mockImplementationOnce(async (callback) =>
        callback({
          deposit: {
            findFirst: depositFindFirstMock,
            update: depositUpdateMock,
            updateMany: depositUpdateManyMock,
          },
          depositPayment: {
            createMany: depositPaymentCreateManyMock,
            findUnique: depositPaymentFindUniqueMock,
            aggregate: depositPaymentAggregateMock,
            findFirst: depositPaymentTransactionFindFirstMock,
            update: depositPaymentTransactionUpdateMock,
          },
          notification: {
            create: notificationCreateMock,
          },
        }),
      );

    depositFindFirstMock.mockResolvedValueOnce(null);

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
        workspaceId: "workspace-1",
        operationKey: "00000000-0000-4000-8000-000000000001",
        depositId: "deposit-1",
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        notes: "",
      });

    expect(result).toEqual({
      success: false,
      reason: "NOT_FOUND",
    });

    expect(transactionMock).toHaveBeenCalledTimes(2);

    for (const call of transactionMock.mock.calls) {
      expect(call[1]).toEqual({
        isolationLevel: "Serializable",
      });
    }
  });

  it("resolves a P2034 operation-key race as an idempotent replay", async () => {
    const conflict = Object.assign(
      new Error("Transaction write conflict"),
      {
        code: "P2034",
      },
    );

    let attempt = 0;

    transactionMock.mockImplementation(async (callback) => {
      attempt += 1;

      if (attempt === 1) {
        throw conflict;
      }

      return callback({
        deposit: {
          findFirst: depositFindFirstMock,
          update: depositUpdateMock,
          updateMany: depositUpdateManyMock,
        },
        depositPayment: {
          createMany: depositPaymentCreateManyMock,
          findUnique: depositPaymentFindUniqueMock,
          aggregate: depositPaymentAggregateMock,
          findFirst: depositPaymentTransactionFindFirstMock,
          update: depositPaymentTransactionUpdateMock,
        },
        notification: {
          create: notificationCreateMock,
        },
      });
    });

    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
      amount: 100,
      status: "PAID",
      projectId: "project-1",
      project: {
        name: "Project One",
        ownerId: "owner-1",
      },
    });

    depositPaymentCreateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    depositPaymentFindUniqueMock.mockResolvedValueOnce({
      id: "payment-race-winner",
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "Paid in full",
      deposit: {
        project: {
          workspaceId: "workspace-1",
        },
      },
    });

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
        workspaceId: "workspace-1",
        operationKey: "00000000-0000-4000-8000-000000000001",
        depositId: "deposit-1",
        amount: 100,
        paymentMethod: "CREDIT_CARD",
        notes: "Paid in full",
      });

    expect(result).toEqual({
      success: true,
      paymentId: "payment-race-winner",
    });

    expect(transactionMock).toHaveBeenCalledTimes(2);
    expect(depositPaymentCreateManyMock).toHaveBeenCalledTimes(1);
    expect(depositPaymentFindUniqueMock).toHaveBeenCalledTimes(1);

    expect(depositPaymentAggregateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
    expect(depositUpdateManyMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("stops retrying P2034 after three attempts", async () => {
    const conflict = Object.assign(
      new Error("Transaction write conflict"),
      {
        code: "P2034",
      },
    );

    transactionMock.mockRejectedValue(conflict);

    await expect(
      prismaDepositPaymentRepository.recordAndSynchronize({
        workspaceId: "workspace-1",
        operationKey: "00000000-0000-4000-8000-000000000001",
        depositId: "deposit-1",
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        notes: "",
      }),
    ).rejects.toBe(conflict);

    expect(transactionMock).toHaveBeenCalledTimes(3);
  });

  it("does not retry unrelated database errors", async () => {
    const error = Object.assign(
      new Error("Unique constraint violation"),
      {
        code: "P2002",
      },
    );

    transactionMock.mockRejectedValueOnce(error);

    await expect(
      prismaDepositPaymentRepository.recordAndSynchronize({
        workspaceId: "workspace-1",
        operationKey: "00000000-0000-4000-8000-000000000001",
        depositId: "deposit-1",
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        notes: "",
      }),
    ).rejects.toBe(error);

    expect(transactionMock).toHaveBeenCalledTimes(1);
  });

  it("atomically records a partial payment and synchronizes the deposit", async () => {
    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
      amount: 100,
      status: "REQUESTED",
      projectId: "project-1",
      project: {
        name: "Project One",
        ownerId: "owner-1",
      },
    });

    depositPaymentCreateManyMock.mockResolvedValueOnce({
      count: 1,
    });

    depositPaymentFindUniqueMock.mockResolvedValueOnce({
      id: "payment-1",
      depositId: "deposit-1",
      amount: 40,
      paymentMethod: "CREDIT_CARD",
      notes: "",
      deposit: {
        project: {
          workspaceId: "workspace-1",
        },
      },
    });

    depositPaymentAggregateMock.mockResolvedValueOnce({
      _sum: {
        amount: 40,
      },
    });

    depositUpdateMock.mockResolvedValueOnce({
      id: "deposit-1",
    });

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
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

    expect(transactionMock).toHaveBeenCalledTimes(1);

    expect(depositFindFirstMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
        project: {
          workspaceId: "workspace-1",
        },
      },
      select: {
        id: true,
        amount: true,
        status: true,
        projectId: true,
        project: {
          select: {
            name: true,
            ownerId: true,
          },
        },
      },
    });

    expect(depositPaymentCreateManyMock).toHaveBeenCalledWith({
      data: {
        depositId: "deposit-1",
        operationKey: "00000000-0000-4000-8000-000000000001",
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        notes: "",
      },
      skipDuplicates: true,
    });

    expect(depositPaymentFindUniqueMock).toHaveBeenCalledWith({
      where: {
        operationKey: "00000000-0000-4000-8000-000000000001",
      },
      select: {
        id: true,
        depositId: true,
        amount: true,
        paymentMethod: true,
        notes: true,
        deposit: {
          select: {
            project: {
              select: {
                workspaceId: true,
              },
            },
          },
        },
      },
    });

    expect(depositPaymentAggregateMock).toHaveBeenCalledWith({
      where: {
        depositId: "deposit-1",
      },
      _sum: {
        amount: true,
      },
    });

    expect(depositUpdateMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
      },
      data: {
        status: "PARTIALLY_PAID",
        paidAt: null,
      },
    });

    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("atomically records full payment and creates the paid notification", async () => {
    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
      amount: 100,
      status: "REQUESTED",
      projectId: "project-1",
      project: {
        name: "Project One",
        ownerId: "owner-1",
      },
    });

    depositPaymentCreateManyMock.mockResolvedValueOnce({
      count: 1,
    });

    depositPaymentFindUniqueMock.mockResolvedValueOnce({
      id: "payment-1",
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "Paid in full",
      deposit: {
        project: {
          workspaceId: "workspace-1",
        },
      },
    });

    depositPaymentAggregateMock.mockResolvedValueOnce({
      _sum: {
        amount: 100,
      },
    });

    depositUpdateManyMock.mockResolvedValueOnce({
      count: 1,
    });

    notificationCreateMock.mockResolvedValueOnce({
      id: "notification-1",
    });

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
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

    expect(depositUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
        status: {
          not: "PAID",
        },
      },
      data: {
        status: "PAID",
        paidAt: expect.any(Date),
      },
    });

    expect(notificationCreateMock).toHaveBeenCalledTimes(1);
    expect(notificationCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "owner-1",
        title: "Deposit paid",
        message: "Deposit for Project One was paid in full.",
        type: "DEPOSIT",
        href: "/projects/project-1",
      },
    });
  });

  it("does not create a duplicate paid notification when the deposit is already paid", async () => {
    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
      amount: 100,
      status: "PAID",
      projectId: "project-1",
      project: {
        name: "Project One",
        ownerId: "owner-1",
      },
    });

    depositPaymentCreateManyMock.mockResolvedValueOnce({
      count: 1,
    });

    depositPaymentFindUniqueMock.mockResolvedValueOnce({
      id: "payment-2",
      depositId: "deposit-1",
      amount: 25,
      paymentMethod: "ACH",
      notes: "",
      deposit: {
        project: {
          workspaceId: "workspace-1",
        },
      },
    });

    depositPaymentAggregateMock.mockResolvedValueOnce({
      _sum: {
        amount: 125,
      },
    });

    depositUpdateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
        workspaceId: "workspace-1",
        operationKey: "00000000-0000-4000-8000-000000000001",
        depositId: "deposit-1",
        amount: 25,
        paymentMethod: "ACH",
        notes: "",
      });

    expect(result).toEqual({
      success: true,
      paymentId: "payment-2",
    });

    expect(notificationCreateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
  });

  it("does not create a payment for a deposit outside the workspace", async () => {
    depositFindFirstMock.mockResolvedValueOnce(null);

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
        workspaceId: "workspace-2",
        operationKey: "00000000-0000-4000-8000-000000000001",
        depositId: "deposit-1",
        amount: 50,
        paymentMethod: "CREDIT_CARD",
        notes: "",
      });

    expect(result).toEqual({
      success: false,
      reason: "NOT_FOUND",
    });

    expect(depositFindFirstMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
        project: {
          workspaceId: "workspace-2",
        },
      },
      select: expect.any(Object),
    });

    expect(depositPaymentCreateManyMock).not.toHaveBeenCalled();
    expect(depositPaymentAggregateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
    expect(depositUpdateManyMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("returns the existing payment for an exact idempotent replay without financial mutation", async () => {
    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
      amount: 100,
      status: "PAID",
      projectId: "project-1",
      project: {
        name: "Project One",
        ownerId: "owner-1",
      },
    });

    depositPaymentCreateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    depositPaymentFindUniqueMock.mockResolvedValueOnce({
      id: "payment-existing",
      depositId: "deposit-1",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "Paid in full",
      deposit: {
        project: {
          workspaceId: "workspace-1",
        },
      },
    });

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
        workspaceId: "workspace-1",
        operationKey: "00000000-0000-4000-8000-000000000001",
        depositId: "deposit-1",
        amount: 100,
        paymentMethod: "CREDIT_CARD",
        notes: "Paid in full",
      });

    expect(result).toEqual({
      success: true,
      paymentId: "payment-existing",
    });

    expect(depositPaymentAggregateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
    expect(depositUpdateManyMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("rejects reuse of an operation key with different payment data", async () => {
    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
      amount: 100,
      status: "REQUESTED",
      projectId: "project-1",
      project: {
        name: "Project One",
        ownerId: "owner-1",
      },
    });

    depositPaymentCreateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    depositPaymentFindUniqueMock.mockResolvedValueOnce({
      id: "payment-existing",
      depositId: "deposit-1",
      amount: 75,
      paymentMethod: "ACH",
      notes: "Different payment",
      deposit: {
        project: {
          workspaceId: "workspace-1",
        },
      },
    });

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
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
    });

    expect(depositPaymentAggregateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
    expect(depositUpdateManyMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("rejects an operation key owned by another workspace without financial mutation", async () => {
    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
      amount: 100,
      status: "REQUESTED",
      projectId: "project-1",
      project: {
        name: "Project One",
        ownerId: "owner-1",
      },
    });

    depositPaymentCreateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    depositPaymentFindUniqueMock.mockResolvedValueOnce({
      id: "payment-other-workspace",
      depositId: "deposit-other",
      amount: 100,
      paymentMethod: "CREDIT_CARD",
      notes: "Paid in full",
      deposit: {
        project: {
          workspaceId: "workspace-2",
        },
      },
    });

    const result =
      await prismaDepositPaymentRepository.recordAndSynchronize({
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
    });

    expect(depositPaymentAggregateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
    expect(depositUpdateManyMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("atomically updates a payment downward and moves the deposit out of PAID", async () => {
    depositPaymentTransactionFindFirstMock.mockResolvedValueOnce({
      id: "payment-1",
      depositId: "deposit-1",
      deposit: {
        amount: 100,
        projectId: "project-1",
        project: {
          name: "Project One",
          ownerId: "owner-1",
        },
      },
    });

    depositPaymentTransactionUpdateMock.mockResolvedValueOnce({
      id: "payment-1",
    });

    depositPaymentAggregateMock.mockResolvedValueOnce({
      _sum: {
        amount: 40,
      },
    });

    depositUpdateMock.mockResolvedValueOnce({
      id: "deposit-1",
    });

    const result =
      await prismaDepositPaymentRepository.updateAndSynchronize({
        workspaceId: "workspace-1",
        paymentId: "payment-1",
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        notes: "",
      });

    expect(result).toEqual({
      success: true,
    });

    expect(depositPaymentTransactionFindFirstMock).toHaveBeenCalledWith({
      where: {
        id: "payment-1",
        deposit: {
          project: {
            workspaceId: "workspace-1",
          },
        },
      },
      select: {
        id: true,
        depositId: true,
        deposit: {
          select: {
            amount: true,
            projectId: true,
            project: {
              select: {
                name: true,
                ownerId: true,
              },
            },
          },
        },
      },
    });

    expect(depositPaymentTransactionUpdateMock).toHaveBeenCalledWith({
      where: {
        id: "payment-1",
      },
      data: {
        amount: 40,
        paymentMethod: "CREDIT_CARD",
        notes: "",
      },
    });

    expect(depositPaymentAggregateMock).toHaveBeenCalledWith({
      where: {
        depositId: "deposit-1",
      },
      _sum: {
        amount: true,
      },
    });

    expect(depositUpdateMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
      },
      data: {
        status: "PARTIALLY_PAID",
        paidAt: null,
      },
    });

    expect(depositUpdateManyMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("atomically updates a payment upward and transitions the deposit into PAID", async () => {
    depositPaymentTransactionFindFirstMock.mockResolvedValueOnce({
      id: "payment-1",
      depositId: "deposit-1",
      deposit: {
        amount: 100,
        projectId: "project-1",
        project: {
          name: "Project One",
          ownerId: "owner-1",
        },
      },
    });

    depositPaymentTransactionUpdateMock.mockResolvedValueOnce({
      id: "payment-1",
    });

    depositPaymentAggregateMock.mockResolvedValueOnce({
      _sum: {
        amount: 100,
      },
    });

    depositUpdateManyMock.mockResolvedValueOnce({
      count: 1,
    });

    notificationCreateMock.mockResolvedValueOnce({
      id: "notification-1",
    });

    const result =
      await prismaDepositPaymentRepository.updateAndSynchronize({
        workspaceId: "workspace-1",
        paymentId: "payment-1",
        amount: 100,
        paymentMethod: "ACH",
        notes: "Paid in full",
      });

    expect(result).toEqual({
      success: true,
    });

    expect(depositUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
        status: {
          not: "PAID",
        },
      },
      data: {
        status: "PAID",
        paidAt: expect.any(Date),
      },
    });

    expect(notificationCreateMock).toHaveBeenCalledTimes(1);
    expect(notificationCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "owner-1",
        title: "Deposit paid",
        message: "Deposit for Project One was paid in full.",
        type: "DEPOSIT",
        href: "/projects/project-1",
      },
    });
  });

  it("does not duplicate the paid notification when an updated deposit is already PAID", async () => {
    depositPaymentTransactionFindFirstMock.mockResolvedValueOnce({
      id: "payment-1",
      depositId: "deposit-1",
      deposit: {
        amount: 100,
        projectId: "project-1",
        project: {
          name: "Project One",
          ownerId: "owner-1",
        },
      },
    });

    depositPaymentTransactionUpdateMock.mockResolvedValueOnce({
      id: "payment-1",
    });

    depositPaymentAggregateMock.mockResolvedValueOnce({
      _sum: {
        amount: 125,
      },
    });

    depositUpdateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    const result =
      await prismaDepositPaymentRepository.updateAndSynchronize({
        workspaceId: "workspace-1",
        paymentId: "payment-1",
        amount: 125,
        paymentMethod: "ACH",
        notes: "",
      });

    expect(result).toEqual({
      success: true,
    });

    expect(notificationCreateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
  });

  it("does not mutate a payment outside the requested workspace", async () => {
    depositPaymentTransactionFindFirstMock.mockResolvedValueOnce(null);

    const result =
      await prismaDepositPaymentRepository.updateAndSynchronize({
        workspaceId: "workspace-2",
        paymentId: "payment-1",
        amount: 75,
        paymentMethod: "ACH",
        notes: "",
      });

    expect(result).toEqual({
      success: false,
      reason: "NOT_FOUND",
    });

    expect(depositPaymentTransactionFindFirstMock).toHaveBeenCalledWith({
      where: {
        id: "payment-1",
        deposit: {
          project: {
            workspaceId: "workspace-2",
          },
        },
      },
      select: expect.any(Object),
    });

    expect(depositPaymentTransactionUpdateMock).not.toHaveBeenCalled();
    expect(depositPaymentAggregateMock).not.toHaveBeenCalled();
    expect(depositUpdateMock).not.toHaveBeenCalled();
    expect(depositUpdateManyMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("scopes payment edit lookup through the deposit project workspace", async () => {
    depositPaymentFindFirstMock.mockResolvedValueOnce({
      id: "payment-1",
      depositId: "deposit-1",
      amount: 50,
      paymentMethod: "CREDIT_CARD",
      receivedAt: new Date("2026-08-28T12:00:00.000Z"),
      notes: null,
    });

    const result = await prismaDepositPaymentRepository.findForEdit({
      workspaceId: "workspace-1",
      paymentId: "payment-1",
    });

    expect(depositPaymentFindFirstMock).toHaveBeenCalledTimes(1);
    expect(depositPaymentFindFirstMock).toHaveBeenCalledWith({
      where: {
        id: "payment-1",
        deposit: {
          project: {
            workspaceId: "workspace-1",
          },
        },
      },
    });

    expect(result).toEqual({
      id: "payment-1",
      depositId: "deposit-1",
      amount: 50,
      paymentMethod: "CREDIT_CARD",
      receivedAt: new Date("2026-08-28T12:00:00.000Z"),
      notes: "",
    });
  });

  it("returns null when no payment exists in the requested workspace", async () => {
    depositPaymentFindFirstMock.mockResolvedValueOnce(null);

    const result = await prismaDepositPaymentRepository.findForEdit({
      workspaceId: "workspace-2",
      paymentId: "payment-1",
    });

    expect(result).toBeNull();

    expect(depositPaymentFindFirstMock).toHaveBeenCalledWith({
      where: {
        id: "payment-1",
        deposit: {
          project: {
            workspaceId: "workspace-2",
          },
        },
      },
    });
  });

  it("scopes payment updates through the deposit project workspace", async () => {
    depositPaymentUpdateManyMock.mockResolvedValueOnce({
      count: 1,
    });

    const result = await prismaDepositPaymentRepository.update({
      workspaceId: "workspace-1",
      paymentId: "payment-1",
      amount: 75,
      paymentMethod: "ACH",
      notes: "Updated payment",
    });

    expect(result).toBe(true);

    expect(depositPaymentUpdateManyMock).toHaveBeenCalledTimes(1);
    expect(depositPaymentUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: "payment-1",
        deposit: {
          project: {
            workspaceId: "workspace-1",
          },
        },
      },
      data: {
        amount: 75,
        paymentMethod: "ACH",
        notes: "Updated payment",
      },
    });
  });

  it("returns false when the workspace-scoped update matches no payment", async () => {
    depositPaymentUpdateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    const result = await prismaDepositPaymentRepository.update({
      workspaceId: "workspace-2",
      paymentId: "payment-1",
      amount: 75,
      paymentMethod: "ACH",
      notes: "",
    });

    expect(result).toBe(false);

    expect(depositPaymentUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: "payment-1",
        deposit: {
          project: {
            workspaceId: "workspace-2",
          },
        },
      },
      data: {
        amount: 75,
        paymentMethod: "ACH",
        notes: "",
      },
    });
  });
});
