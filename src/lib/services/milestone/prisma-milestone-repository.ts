import { prisma } from "@/lib/prisma";
import type {
  MilestoneRecord,
  MilestoneRepository,
  MilestoneStatus,
} from "./milestone-repository";

export class PrismaMilestoneRepository implements MilestoneRepository {
  async projectExistsInWorkspace(input: {
    projectId: string;
    workspaceId: string;
  }): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
      },
    });

    return Boolean(project);
  }

  async createMilestone(input: {
    projectId: string;
    title: string;
    dueDate: Date | null;
  }): Promise<MilestoneRecord> {
    return prisma.milestone.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        status: "PENDING",
        dueDate: input.dueDate,
      },
      select: {
        id: true,
        projectId: true,
        title: true,
        status: true,
        dueDate: true,
      },
    });
  }

  async findMilestoneForMutation(input: {
    milestoneId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<MilestoneRecord | null> {
    return prisma.milestone.findFirst({
      where: {
        id: input.milestoneId,
        projectId: input.projectId,
        project: {
          workspaceId: input.workspaceId,
        },
      },
      select: {
        id: true,
        projectId: true,
        title: true,
        status: true,
        dueDate: true,
      },
    });
  }

  async updateMilestoneStatus(input: {
    milestoneId: string;
    status: MilestoneStatus;
  }): Promise<MilestoneRecord> {
    return prisma.milestone.update({
      where: {
        id: input.milestoneId,
      },
      data: {
        status: input.status,
      },
      select: {
        id: true,
        projectId: true,
        title: true,
        status: true,
        dueDate: true,
      },
    });
  }

  async deleteMilestone(milestoneId: string): Promise<void> {
    await prisma.milestone.delete({
      where: {
        id: milestoneId,
      },
    });
  }
}

export const prismaMilestoneRepository = new PrismaMilestoneRepository();
