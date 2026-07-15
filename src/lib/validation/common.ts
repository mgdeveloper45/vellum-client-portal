import { z } from "zod";

export const entityIdSchema = z
  .string()
  .trim()
  .min(1, "An identifier is required.");

// Compatibility alias for schemas already importing cuidSchema.
// Prisma currently generates these IDs with @default(cuid()).
export const cuidSchema = entityIdSchema;

export const uuidSchema = z.string().trim().pipe(z.uuid());

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const requiredString = z
  .string()
  .trim()
  .min(1, "This field is required.");

export const optionalString = z.string().trim().optional();

export const positiveNumber = z.number().positive();

export const nonNegativeNumber = z.number().nonnegative();

export const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Enter a valid six-digit hexadecimal color.");

export const urlSchema = z.string().trim().pipe(z.url());
