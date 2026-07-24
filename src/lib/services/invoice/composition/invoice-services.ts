import { CreateInvoiceService } from "../create-invoice-service";
import { DeleteInvoiceService } from "../delete-invoice-service";
import { GetInvoicePdfService } from "../get-invoice-pdf-service";
import { GetInvoicesService } from "../get-invoices-service";
import { prismaInvoiceRepository } from "../prisma-invoice-repository";
import { ToggleInvoicePaidService } from "../toggle-invoice-paid-service";

export const createInvoiceService = new CreateInvoiceService(
  prismaInvoiceRepository,
);

export const toggleInvoicePaidService = new ToggleInvoicePaidService(
  prismaInvoiceRepository,
);

export const deleteInvoiceService = new DeleteInvoiceService(
  prismaInvoiceRepository,
);

export const getInvoicesService = new GetInvoicesService(
  prismaInvoiceRepository,
);

export const getInvoicePdfService = new GetInvoicePdfService(
  prismaInvoiceRepository,
);
