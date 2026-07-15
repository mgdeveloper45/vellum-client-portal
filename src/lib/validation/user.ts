import { z } from "zod";
import {
  emailSchema,
  entityIdSchema,
  requiredString,
} from "@/lib/validation/common";

export const managedUserRoleSchema = z.enum(["ADMIN", "CLIENT"]);

export const createUserSchema = z.object({
  firstName: requiredString.max(100, "First name is too long."),

  lastName: requiredString.max(100, "Last name is too long."),

  email: emailSchema,

  role: managedUserRoleSchema,

  password: z
    .string()
    .min(12, "Password must be at least 12 characters.")
    .max(128, "Password is too long.")
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/\d/, "Password must include a number.")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character."),
});

export const updateUserSchema = z.object({
  userId: entityIdSchema,

  firstName: requiredString.max(100, "First name is too long."),

  lastName: requiredString.max(100, "Last name is too long."),

  email: emailSchema,

  role: managedUserRoleSchema,

  isActive: z.boolean(),
});
