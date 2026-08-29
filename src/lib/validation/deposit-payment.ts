import { z } from "zod";

import { entityIdSchema } from "@/lib/validation/common";

export const recordDepositPaymentSchema = z.object({
  depositId: entityIdSchema,

  operationKey: z.string().uuid("Invalid payment operation key."),

  amount: z.coerce
    .number()
    .positive("Payment amount must be greater than zero."),

  paymentMethod: z.enum([
    "CASH",
    "CHECK",
    "ACH",
    "CREDIT_CARD",
    "BANK_TRANSFER",
    "OTHER",
  ]),

  notes: z.preprocess((value) => value ?? "", z.string().trim().max(1000)),
});

export type RecordDepositPaymentInput = z.infer<
  typeof recordDepositPaymentSchema
>;
