import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateInvoiceReminderAction } from "../invoice-action";
import { executeInvoiceReminderAction } from "../execute-invoice-reminder-action";
import { prismaInvoiceRepository } from "@/lib/services/invoice/prisma-invoice-repository";

vi.mock("../invoice-action", () => ({
  generateInvoiceReminderAction: vi.fn(),
}));

vi.mock("@/lib/services/invoice/prisma-invoice-repository", () => ({
  prismaInvoiceRepository: {
    findInvoices: vi.fn(),
    findInvoiceForPdf: vi.fn(),
  },
}));

const mockedFindInvoices = vi.mocked(prismaInvoiceRepository.findInvoices);

const mockedFindInvoiceForPdf = vi.mocked(
  prismaInvoiceRepository.findInvoiceForPdf,
);

const mockedGenerateInvoiceReminderAction = vi.mocked(
  generateInvoiceReminderAction,
);

const unpaidInvoice = {
  id: "invoice-1",
  amount: 2450,
  paid: false,
  createdAt: new Date("2026-08-01T12:00:00Z"),
  project: {
    id: "project-1",
    name: "Kitchen Remodel",
    client: {
      id: "client-1",
      firstName: "John",
      lastName: "Smith",
    },
  },
};

const paidInvoice = {
  id: "invoice-paid",
  amount: 1000,
  paid: true,
  createdAt: new Date("2026-07-01T12:00:00Z"),
  project: {
    id: "project-2",
    name: "Bathroom Remodel",
    client: {
      id: "client-2",
      firstName: "Jane",
      lastName: "Doe",
    },
  },
};

const fullInvoice = {
  id: "invoice-1",
  amount: 2450,
  paid: false,
  createdAt: new Date("2026-08-01T12:00:00Z"),
  project: {
    id: "project-1",
    name: "Kitchen Remodel",
    client: {
      firstName: "John",
      lastName: "Smith",
    },
    workspace: {
      name: "Vellum Workspace",
      companyName: "Vellum Construction",
    },
  },
};

describe("executeInvoiceReminderAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns an error when there are no unpaid invoices", async () => {
    mockedFindInvoices.mockResolvedValue([paidInvoice]);

    const result = await executeInvoiceReminderAction("workspace-1");

    expect(result).toEqual({
      success: false,
      message: "No unpaid invoices found.",
    });

    expect(mockedFindInvoices).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
    });

    expect(mockedFindInvoiceForPdf).not.toHaveBeenCalled();

    expect(mockedGenerateInvoiceReminderAction).not.toHaveBeenCalled();
  });

  it("requires the user to specify an invoice when multiple are unpaid", async () => {
    mockedFindInvoices.mockResolvedValue([
      unpaidInvoice,
      {
        ...unpaidInvoice,
        id: "invoice-2",
        amount: 1800,
      },
    ]);

    const result = await executeInvoiceReminderAction("workspace-1");

    expect(result).toEqual({
      success: false,
      message:
        "Multiple unpaid invoices were found. Please specify which invoice you want to draft a reminder for.",
    });

    expect(mockedFindInvoiceForPdf).not.toHaveBeenCalled();

    expect(mockedGenerateInvoiceReminderAction).not.toHaveBeenCalled();
  });

  it("returns an error when the selected invoice can no longer be found", async () => {
    mockedFindInvoices.mockResolvedValue([unpaidInvoice]);

    mockedFindInvoiceForPdf.mockResolvedValue(null);

    const result = await executeInvoiceReminderAction("workspace-1");

    expect(mockedFindInvoiceForPdf).toHaveBeenCalledWith({
      invoiceId: "invoice-1",
      workspaceId: "workspace-1",
    });

    expect(result).toEqual({
      success: false,
      message: "Invoice not found.",
    });

    expect(mockedGenerateInvoiceReminderAction).not.toHaveBeenCalled();
  });

  it("generates a reminder using the real invoice context", async () => {
    mockedFindInvoices.mockResolvedValue([unpaidInvoice]);

    mockedFindInvoiceForPdf.mockResolvedValue(fullInvoice);

    mockedGenerateInvoiceReminderAction.mockResolvedValue({
      type: "EMAIL",
      title: "Invoice Reminder • invoice-1",
      preview: "Hello John...",
      content: "Hello John, this is a payment reminder.",
    });

    const result = await executeInvoiceReminderAction("workspace-1");

    expect(mockedFindInvoices).toHaveBeenCalledWith({
      workspaceId: "workspace-1",
    });

    expect(mockedFindInvoiceForPdf).toHaveBeenCalledWith({
      invoiceId: "invoice-1",
      workspaceId: "workspace-1",
    });

    expect(mockedGenerateInvoiceReminderAction).toHaveBeenCalledWith({
      clientName: "John Smith",
      businessName: "Vellum Construction",
      projectName: "Kitchen Remodel",
      invoiceId: "invoice-1",
      amount: 2450,
    });

    expect(result).toEqual({
      success: true,
      document: {
        type: "EMAIL",
        title: "Invoice Reminder • invoice-1",
        preview: "Hello John...",
        content: "Hello John, this is a payment reminder.",
      },
    });
  });

  it("ignores paid invoices when exactly one invoice is unpaid", async () => {
    mockedFindInvoices.mockResolvedValue([paidInvoice, unpaidInvoice]);

    mockedFindInvoiceForPdf.mockResolvedValue(fullInvoice);

    mockedGenerateInvoiceReminderAction.mockResolvedValue({
      type: "EMAIL",
      title: "Invoice Reminder • invoice-1",
      preview: "Reminder",
      content: "Invoice reminder.",
    });

    await executeInvoiceReminderAction("workspace-1");

    expect(mockedFindInvoiceForPdf).toHaveBeenCalledTimes(1);

    expect(mockedFindInvoiceForPdf).toHaveBeenCalledWith({
      invoiceId: "invoice-1",
      workspaceId: "workspace-1",
    });

    expect(mockedGenerateInvoiceReminderAction).toHaveBeenCalledTimes(1);
  });
});
