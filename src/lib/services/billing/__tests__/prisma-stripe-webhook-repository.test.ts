import { beforeEach, describe, expect, it, vi } from "vitest";

const { createManyMock, updateManyMock, updateMock } = vi.hoisted(() => ({
  createManyMock: vi.fn(),
  updateManyMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeWebhookEvent: {
      createMany: createManyMock,
      updateMany: updateManyMock,
      update: updateMock,
    },
  },
}));

import { PrismaStripeWebhookRepository } from "@/lib/services/billing/prisma-stripe-webhook-repository";

describe("PrismaStripeWebhookRepository.beginEvent", () => {
  let repository: PrismaStripeWebhookRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    repository = new PrismaStripeWebhookRepository();
  });

  it("claims a new webhook event", async () => {
    createManyMock.mockResolvedValueOnce({
      count: 1,
    });

    const claimed = await repository.beginEvent(
      "evt_new",
      "checkout.session.completed",
    );

    expect(claimed).toBe(true);

    expect(createManyMock).toHaveBeenCalledWith({
      data: {
        id: "evt_new",
        type: "checkout.session.completed",
        status: "PROCESSING",
      },
      skipDuplicates: true,
    });

    expect(updateManyMock).not.toHaveBeenCalled();
  });

  it("reclaims a previously failed event", async () => {
    createManyMock.mockResolvedValueOnce({
      count: 0,
    });

    updateManyMock.mockResolvedValueOnce({
      count: 1,
    });

    const claimed = await repository.beginEvent(
      "evt_failed",
      "checkout.session.completed",
    );

    expect(claimed).toBe(true);

    expect(updateManyMock).toHaveBeenCalledWith({
      where: {
        id: "evt_failed",
        status: "FAILED",
      },
      data: {
        type: "checkout.session.completed",
        status: "PROCESSING",
        error: null,
        processedAt: null,
      },
    });
  });

  it("does not reclaim a processing or processed event", async () => {
    createManyMock.mockResolvedValueOnce({
      count: 0,
    });

    updateManyMock.mockResolvedValueOnce({
      count: 0,
    });

    const claimed = await repository.beginEvent(
      "evt_existing",
      "checkout.session.completed",
    );

    expect(claimed).toBe(false);
  });
});
