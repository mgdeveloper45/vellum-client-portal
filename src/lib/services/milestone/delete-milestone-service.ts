import type {
  MilestoneRecord,
  MilestoneRepository,
} from "./milestone-repository";

export type DeleteMilestoneServiceResult =
  | {
      success: true;
      milestone: MilestoneRecord;
    }
  | {
      success: false;
      code: "MILESTONE_NOT_FOUND";
    };

export class DeleteMilestoneService {
  constructor(private readonly milestoneRepository: MilestoneRepository) {}

  async execute(input: {
    milestoneId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<DeleteMilestoneServiceResult> {
    const milestone =
      await this.milestoneRepository.findMilestoneForMutation(input);

    if (!milestone) {
      return {
        success: false,
        code: "MILESTONE_NOT_FOUND",
      };
    }

    await this.milestoneRepository.deleteMilestone(milestone.id);

    return {
      success: true,
      milestone,
    };
  }
}
