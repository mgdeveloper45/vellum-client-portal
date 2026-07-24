import { CreateProposalService } from "../create-proposal-service";
import { DeleteProposalService } from "../delete-proposal-service";
import { GetProposalsService } from "../get-proposals-service";
import { prismaProposalRepository } from "../prisma-proposal-repository";
import { ToggleProposalApprovalService } from "../toggle-proposal-approval-service";

export const createProposalService = new CreateProposalService(
  prismaProposalRepository,
);

export const toggleProposalApprovalService = new ToggleProposalApprovalService(
  prismaProposalRepository,
);

export const deleteProposalService = new DeleteProposalService(
  prismaProposalRepository,
);

export const getProposalsService = new GetProposalsService(
  prismaProposalRepository,
);
