import type {
  MilestoneRecord,
  MilestoneRepository,
} from "./milestone-repository";

export type CreateMilestoneServiceResult =
  | {
      success: true;
      milestone: MilestoneRecord;
    }
  | {
      success: false;
      code: "PROJECT_NOT_FOUND";
    };

export class CreateMilestoneService {
  constructor(private readonly milestoneRepository: MilestoneRepository) {}

  async execute(input: {
    projectId: string;
    workspaceId: string;
    title: string;
    dueDate: string | null;
  }): Promise<CreateMilestoneServiceResult> {
    const projectExists =
      await this.milestoneRepository.projectExistsInWorkspace({
        projectId: input.projectId,
        workspaceId: input.workspaceId,
      });

    if (!projectExists) {
      return {
        success: false,
        code: "PROJECT_NOT_FOUND",
      };
    }

    const milestone = await this.milestoneRepository.createMilestone({
      projectId: input.projectId,
      title: input.title,
      dueDate: input.dueDate ? new Date(`${input.dueDate}T00:00:00`) : null,
    });

    return {
      success: true,
      milestone,
    };
  }
}
