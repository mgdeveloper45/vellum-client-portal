import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  depositUpdateManyMock,
  depositFindFirstMock,
  notificationCreateMock,
  transactionMock,
} = vi.hoisted(() => ({
  depositUpdateManyMock: vi.fn(),
  depositFindFirstMock: vi.fn(),
  notificationCreateMock: vi.fn(),
  transactionMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
  },
}));

import { prismaDepositRepository } from "../prisma-deposit-repository";

describe("prismaDepositRepository.synchronizeFinancialStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    transactionMock.mockImplementation(
      async (
        callback: (transaction: {
          deposit: {
            updateMany: typeof depositUpdateManyMock;
            findFirst: typeof depositFindFirstMock;
          };
          notification: {
            create: typeof notificationCreateMock;
          };
        }) => Promise<boolean>,
      ) =>
        callback({
          deposit: {
            updateMany: depositUpdateManyMock,
            findFirst: depositFindFirstMock,
          },
          notification: {
            create: notificationCreateMock,
          },
        }),
    );

    depositUpdateManyMock.mockResolvedValue({
      count: 1,
    });

    depositFindFirstMock.mockResolvedValue(null);

    notificationCreateMock.mockResolvedValue({
      id: "notification-1",
    });
  });

  it("atomically claims a transition into PAID and creates one notification", async () => {
    const paidAt = new Date("2026-08-27T12:00:00.000Z");

    const result =
      await prismaDepositRepository.synchronizeFinancialStatus({
        depositId: "deposit-1",
        status: "PAID",
        paidAt,
        projectId: "project-1",
        projectName: "Project One",
        ownerId: "owner-1",
      });

    expect(result).toBe(true);

    expect(depositUpdateManyMock).toHaveBeenCalledTimes(1);
    expect(depositUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
        status: {
          not: "PAID",
        },
      },
      data: {
        status: "PAID",
        paidAt,
      },
    });

    expect(depositFindFirstMock).not.toHaveBeenCalled();

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

  it("preserves paidAt and does not notify when the deposit is already PAID", async () => {
    const attemptedPaidAt = new Date("2026-08-27T13:00:00.000Z");

    depositUpdateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
    });

    const result =
      await prismaDepositRepository.synchronizeFinancialStatus({
        depositId: "deposit-1",
        status: "PAID",
        paidAt: attemptedPaidAt,
        projectId: "project-1",
        projectName: "Project One",
        ownerId: "owner-1",
      });

    expect(result).toBe(true);

    expect(depositUpdateManyMock).toHaveBeenCalledTimes(1);
    expect(depositUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
        status: {
          not: "PAID",
        },
      },
      data: {
        status: "PAID",
        paidAt: attemptedPaidAt,
      },
    });

    expect(depositFindFirstMock).toHaveBeenCalledTimes(1);
    expect(depositFindFirstMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
        status: "PAID",
      },
      select: {
        id: true,
      },
    });

    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("does not duplicate the notification when a competing PAID transition already won", async () => {
    depositUpdateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    depositFindFirstMock.mockResolvedValueOnce({
      id: "deposit-1",
    });

    const result =
      await prismaDepositRepository.synchronizeFinancialStatus({
        depositId: "deposit-1",
        status: "PAID",
        paidAt: new Date("2026-08-27T13:00:00.000Z"),
        projectId: "project-1",
        projectName: "Project One",
        ownerId: "owner-1",
      });

    expect(result).toBe(true);
    expect(depositUpdateManyMock).toHaveBeenCalledTimes(1);
    expect(depositFindFirstMock).toHaveBeenCalledTimes(1);
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("clears paidAt when a deposit moves out of PAID", async () => {
    const result =
      await prismaDepositRepository.synchronizeFinancialStatus({
        depositId: "deposit-1",
        status: "PARTIALLY_PAID",
        paidAt: null,
        projectId: "project-1",
        projectName: "Project One",
        ownerId: "owner-1",
      });

    expect(result).toBe(true);

    expect(depositUpdateManyMock).toHaveBeenCalledTimes(1);
    expect(depositUpdateManyMock).toHaveBeenCalledWith({
      where: {
        id: "deposit-1",
      },
      data: {
        status: "PARTIALLY_PAID",
        paidAt: null,
      },
    });

    expect(depositFindFirstMock).not.toHaveBeenCalled();
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });

  it("returns false and does not notify when the deposit does not exist", async () => {
    depositUpdateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    depositFindFirstMock.mockResolvedValueOnce(null);

    const result =
      await prismaDepositRepository.synchronizeFinancialStatus({
        depositId: "missing-deposit",
        status: "PAID",
        paidAt: new Date("2026-08-27T12:00:00.000Z"),
        projectId: "project-1",
        projectName: "Project One",
        ownerId: "owner-1",
      });

    expect(result).toBe(false);

    expect(depositUpdateManyMock).toHaveBeenCalledTimes(1);
    expect(depositFindFirstMock).toHaveBeenCalledTimes(1);
    expect(notificationCreateMock).not.toHaveBeenCalled();
  });
});
