import { z } from "zod";
import {
  emailSchema,
  entityIdSchema,
  requiredString,
} from "@/lib/validation/common";

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")
  .refine(
    (value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()),
    "Enter a valid date.",
  );

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.");

const optionalTrimmedString = z.preprocess(
  (value) => (value == null || value === "" ? undefined : value),
  z.string().trim().optional(),
);

export const bookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

export const createBookingSchema = z.object({
  serviceId: entityIdSchema,
  workspaceId: entityIdSchema,

  customerName: requiredString.max(200, "Customer name is too long."),

  customerEmail: emailSchema,

  customerPhone: optionalTrimmedString.refine(
    (value) => !value || /^[+()\-\s\d]{7,30}$/.test(value),
    "Enter a valid phone number.",
  ),

  notes: optionalTrimmedString.refine(
    (value) => !value || value.length <= 5000,
    "Notes are too long.",
  ),

  date: dateSchema,
  startTime: timeSchema,
});

export const updateBookingStatusSchema = z.object({
  bookingId: entityIdSchema,
  status: bookingStatusSchema,
});

export const rescheduleBookingSchema = z.object({
  bookingId: entityIdSchema,
  date: dateSchema,
  startTime: timeSchema,
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
