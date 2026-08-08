import type { InvoiceRepository } from "@/lib/services/invoice/invoice-repository";

export function createInvoiceRepositoryMock(
  overrides: Partial<InvoiceRepository> = {},
): InvoiceRepository {
  return {
    projectExistsInWorkspace: async () => false,

    createInvoice: async () => {
      throw new Error("Not implemented");
    },

    findInvoiceForMutation: async () => null,

    updateInvoicePaid: async () => {
      throw new Error("Not implemented");
    },

    deleteInvoice: async () => {},

    findInvoices: async () => [],

    findInvoiceForPdf: async () => null,

    ...overrides,
  };
}
