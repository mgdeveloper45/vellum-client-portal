import { z } from "zod";
import {
  emailSchema,
  entityIdSchema,
  requiredString,
} from "@/lib/validation/common";


const clientStatusSchema = z.enum([
    "LEAD",
    "WAITLIST",
    "CONSULTATION",
    "DEPOSIT_PENDING",
    "ACTIVE",
    "COMPLETED",
    "ARCHIVED",
    "BANNED",
]);

const notesSchema = z.preprocess(
  (value) => (value == null ? "" : value),
  z.string().trim().max(5000),
);

export const createClientSchema = z.object({
    firstName: requiredString.max(100, "First name is too long."),

    lastName: requiredString.max(100, "Last name is too long."),

    email: emailSchema,
    
    notes: notesSchema,

    clientStatus: clientStatusSchema.default("LEAD"),
});

export const updateClientSchema = createClientSchema.extend({
    clientId: entityIdSchema,
    isBlacklisted: z.boolean(),
});

export const deleteClientSchema = z.object({
  clientId: entityIdSchema,
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
