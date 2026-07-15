import { z } from "zod";
import { entityIdSchema, requiredString } from "@/lib/validation/common";

const optionalDateSchema = z.preprocess(
  (value) => (value == null || value === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid due date.")
    .refine(
      (value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()),
      "Enter a valid due date.",
    )
    .optional(),
);

export const createMilestoneSchema = z.object({
  projectId: entityIdSchema,

  title: requiredString.max(200, "Milestone title is too long."),

  dueDate: optionalDateSchema,
});

export const milestoneMutationSchema = z.object({
  milestoneId: entityIdSchema,
  projectId: entityIdSchema,
});
