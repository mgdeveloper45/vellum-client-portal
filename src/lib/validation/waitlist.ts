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
    (value) =>
      !Number.isNaN(
        new Date(`${value}T00:00:00`).getTime(),
      ),
    "Enter a valid date.",
  );

const optionalTimeSchema = z.preprocess(
  (value) =>
    value == null || value === ""
      ? undefined
      : value,
  z
    .string()
    .trim()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Enter a valid time.",
    )
    .optional(),
);

const optionalTrimmedString = z.preprocess(
  (value) =>
    value == null || value === ""
      ? undefined
      : value,
  z.string().trim().optional(),
);

export const waitlistStatusSchema = z.enum([
  "WAITING",
  "NOTIFIED",
  "BOOKED",
  "EXPIRED",
  "CANCELLED",
]);

export const joinWaitlistSchema = z
  .object({
    workspaceId: entityIdSchema,
    serviceId: entityIdSchema,

    customerName: requiredString.max(
      200,
      "Customer name is too long.",
    ),

    customerEmail: emailSchema,

    customerPhone: optionalTrimmedString.refine(
      (value) =>
        !value ||
        /^[+()\-\s\d]{7,30}$/.test(value),
      "Enter a valid phone number.",
    ),

    notes: optionalTrimmedString.refine(
      (value) =>
        !value || value.length <= 5000,
      "Notes are too long.",
    ),

    requestedDate: dateSchema,

    preferredStartTime: optionalTimeSchema,
    preferredEndTime: optionalTimeSchema,
  })
  .superRefine((value, context) => {
    if (
      value.preferredStartTime &&
      value.preferredEndTime &&
      value.preferredEndTime <=
        value.preferredStartTime
    ) {
      context.addIssue({
        code: "custom",
        path: ["preferredEndTime"],
        message:
          "Preferred end time must be after preferred start time.",
      });
    }
  });

export const cancelWaitlistEntrySchema = z.object({
  waitlistEntryId: entityIdSchema,
});

export type JoinWaitlistInput =
  z.infer<typeof joinWaitlistSchema>;

export type CancelWaitlistEntryInput =
  z.infer<typeof cancelWaitlistEntrySchema>;
