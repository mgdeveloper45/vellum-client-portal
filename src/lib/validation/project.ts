import { z } from "zod";
import { entityIdSchema, requiredString } from "@/lib/validation/common";

export const projectStatusSchema = z.enum([
  "PLANNING",
  "ACTIVE",
  "REVIEW",
  "COMPLETED",
]);

export const createProjectSchema = z.object({
  name: requiredString.max(200),

  description: requiredString.max(10000),

  clientId: entityIdSchema,

  ownerId: entityIdSchema,

  status: projectStatusSchema,
});

export const updateProjectSchema = createProjectSchema.extend({
  projectId: entityIdSchema,
});

export const deleteProjectSchema = z.object({
  projectId: entityIdSchema,
});
