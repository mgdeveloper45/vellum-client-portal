import { z } from "zod";
import { entityIdSchema } from "@/lib/validation/common";

const invoiceAmountSchema = z.coerce
  .number()
  .finite()
  .positive("Invoice amount must be greater than zero.")
  .max(1_000_000, "Invoice amount is too large.");

export const createInvoiceSchema = z.object({
  projectId: entityIdSchema,
  amount: invoiceAmountSchema,
});

export const invoiceMutationSchema = z.object({
  invoiceId: entityIdSchema,
  projectId: entityIdSchema,
});
