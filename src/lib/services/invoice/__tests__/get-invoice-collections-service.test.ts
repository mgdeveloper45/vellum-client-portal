import { describe, expect, it } from "vitest";
import { GetInvoiceCollectionsService } from "../get-invoice-collections-service";
import { createInvoiceRepositoryMock } from '../../../../test/factories/invoice-repository-factory';

describe("GetInvoiceCollectionsService", () => {
  it("summarizes invoices", async () => {
    const repository = 
        createInvoiceRepositoryMock({
      findInvoices: async () => [
        {
          id: "1",
          amount: 100,
          paid: false,
          createdAt: new Date(),
          project: {
            id: "1",
            name: "Kitchen",
            client: {
              id: "1",
              firstName: "John",
              lastName: "Smith",
            },
          },
        },
        {
          id: "2",
          amount: 200,
          paid: true,
          createdAt: new Date(),
          project: {
            id: "2",
            name: "Bathroom",
            client: {
              id: "2",
              firstName: "Jane",
              lastName: "Doe",
            },
          },
        },
      ],
    });

    const service =
      new GetInvoiceCollectionsService(
        repository,
      );

    const result =
      await service.execute({
        workspaceId: "workspace-1",
      });

    expect(
      result.outstandingRevenue,
    ).toBe(100);

    expect(
      result.paidRevenue,
    ).toBe(200);

    expect(
      result.unpaidCount,
    ).toBe(1);

    expect(
      result.paidCount,
    ).toBe(1);
  });
});