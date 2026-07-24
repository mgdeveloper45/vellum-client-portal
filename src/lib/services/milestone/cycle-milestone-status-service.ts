import type {
  MilestoneRecord,
  MilestoneRepository,
  MilestoneStatus,
} from "./milestone-repository";

export type CycleMilestoneStatusServiceResult =
  | {
      success: true;
      milestone: MilestoneRecord;
      previousStatus: MilestoneStatus;
    }
  | {
      success: false;
      code: "MILESTONE_NOT_FOUND";
    };

function getNextMilestoneStatus(status: MilestoneStatus): MilestoneStatus {
  if (status === "PENDING") {
    return "IN_PROGRESS";
  }

  if (status === "IN_PROGRESS") {
    return "COMPLETE";
  }

  return "PENDING";
}

export class CycleMilestoneStatusService {
  constructor(private readonly milestoneRepository: MilestoneRepository) {}

  async execute(input: {
    milestoneId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<CycleMilestoneStatusServiceResult> {
    const milestone =
      await this.milestoneRepository.findMilestoneForMutation(input);

    if (!milestone) {
      return {
        success: false,
        code: "MILESTONE_NOT_FOUND",
      };
    }

    const previousStatus = milestone.status;
    const nextStatus = getNextMilestoneStatus(previousStatus);

    const updatedMilestone =
      await this.milestoneRepository.updateMilestoneStatus({
        milestoneId: milestone.id,
        status: nextStatus,
      });

    return {
      success: true,
      milestone: updatedMilestone,
      previousStatus,
    };
  }
}
