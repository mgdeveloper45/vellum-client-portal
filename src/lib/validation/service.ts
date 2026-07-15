import { z } from "zod";
import { entityIdSchema, requiredString } from "@/lib/validation/common";

const optionalDescriptionSchema = z.preprocess(
  (value) => (value == null || value === "" ? undefined : value),
  z.string().trim().max(5000, "Service description is too long.").optional(),
);

const serviceDurationSchema = z.coerce
  .number()
  .int("Duration must be a whole number.")
  .min(5, "Duration must be at least 5 minutes.")
  .max(1440, "Duration cannot exceed 24 hours.");

const servicePriceSchema = z.coerce
  .number()
  .finite()
  .min(0, "Service price cannot be negative.")
  .max(1_000_000, "Service price is too large.");

export const createServiceSchema = z.object({
  name: requiredString.max(200, "Service name is too long."),

  description: optionalDescriptionSchema,

  duration: serviceDurationSchema,

  priceDollars: servicePriceSchema,
});

export const toggleServiceActiveSchema = z.object({
  serviceId: entityIdSchema,
  active: z.boolean(),
});
