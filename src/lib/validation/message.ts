import { z } from "zod";
import { entityIdSchema, requiredString } from "@/lib/validation/common";

export const createMessageSchema = z.object({
  projectId: entityIdSchema,

  content: requiredString.max(
    10_000,
    "Message cannot exceed 10,000 characters.",
  ),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
