import { z } from "zod";
import { entityIdSchema } from "@/lib/validation/common";

export const createProposalSchema = z.object({
  projectId: entityIdSchema,
});

export const proposalMutationSchema = z.object({
  proposalId: entityIdSchema,
  projectId: entityIdSchema,
});
