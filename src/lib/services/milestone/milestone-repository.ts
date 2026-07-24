export type MilestoneStatus = "PENDING" | "IN_PROGRESS" | "COMPLETE";

export type MilestoneRecord = {
  id: string;
  projectId: string;
  title: string;
  status: MilestoneStatus;
  dueDate: Date | null;
};

export interface MilestoneRepository {
  projectExistsInWorkspace(input: {
    projectId: string;
    workspaceId: string;
  }): Promise<boolean>;

  createMilestone(input: {
    projectId: string;
    title: string;
    dueDate: Date | null;
  }): Promise<MilestoneRecord>;

  findMilestoneForMutation(input: {
    milestoneId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<MilestoneRecord | null>;

  updateMilestoneStatus(input: {
    milestoneId: string;
    status: MilestoneStatus;
  }): Promise<MilestoneRecord>;

  deleteMilestone(milestoneId: string): Promise<void>;
}
