import { z } from "zod";

import { entityIdSchema } from "@/lib/validation/common";

export const requestDepositSchema = z.object({
  projectId: entityIdSchema,

  amount: z.coerce
    .number()
    .positive("Deposit amount must be greater than zero."),

  dueDate: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : null)),

  notes: z.preprocess((value) => value ?? "", z.string().trim().max(1000)),
});

export const updateDepositSchema = requestDepositSchema.extend({
  depositId: entityIdSchema,

  status: z.enum([
    "REQUESTED",
    "PARTIALLY_PAID",
    "PAID",
    "REFUNDED",
    "CANCELLED",
  ]),

  paymentMethod: z
    .enum(["CASH", "CHECK", "ACH", "CREDIT_CARD", "BANK_TRANSFER", "OTHER"])
    .nullable(),

  paidAt: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : null)),
});

export type RequestDepositInput = z.infer<typeof requestDepositSchema>;

export type UpdateDepositInput = z.infer<typeof updateDepositSchema>;
