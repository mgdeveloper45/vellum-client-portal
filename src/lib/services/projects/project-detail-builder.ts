import { getR2DownloadUrl } from "@/lib/r2";
import { formatStatus } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import {
  buildProjectFinancialSummary,
} from "./project-financial-summary";
import type {
  ProjectDetailRecord,
  ProjectRepository,
} from "./project-repository";

export interface BuildProjectDetailRequest {
  workspaceId: string;
  projectId: string;
  viewerUserId: string;
  canManageProjects: boolean;
}

export interface ProjectTimelineItem {
  id: string;
  type: "Message" | "Invoice" | "Proposal" | "Milestone";
  title: string;
  detail: string;
  date: Date;
}

export interface ProjectFileViewModel {
  id: string;
  name: string;
  url: string;
  fileType: string;
  projectId: string;
  createdAt: Date;
  downloadUrl: string;
}

export interface ProjectDetailViewModel {
  project: ProjectDetailRecord;
  timelineItems: ProjectTimelineItem[];
  projectFiles: ProjectFileViewModel[];
  deposits: ProjectDetailRecord["deposits"];

  financialSummary: {
    depositTotal: number;
    invoiceTotal: number;
    outstandingBalance: number;
  };
}

interface ProjectDetailBuilderDependencies {
  projectRepository: ProjectRepository;
  getDownloadUrl: (objectKey: string) => Promise<string>;
}

export function createProjectDetailBuilder({
  projectRepository,
  getDownloadUrl,
}: ProjectDetailBuilderDependencies) {
  return async function buildProjectDetail(
    request: BuildProjectDetailRequest,
  ): Promise<ProjectDetailViewModel | null> {
    const project = await projectRepository.findDetail({
      workspaceId: request.workspaceId.trim(),
      projectId: request.projectId.trim(),
      clientId: request.canManageProjects
        ? undefined
        : request.viewerUserId.trim(),
    });

    if (!project) {
      return null;
    }

    const timelineItems: ProjectTimelineItem[] = [
      ...project.messages.map((message) => ({
        id: message.id,
        type: "Message" as const,
        title: `${message.sender.firstName} ${message.sender.lastName} sent a message`,
        detail: message.content,
        date: message.createdAt,
      })),

      ...project.invoices.map((invoice) => ({
        id: invoice.id,
        type: "Invoice" as const,
        title: invoice.paid ? "Invoice paid" : "Invoice created",
        detail: formatMoney(invoice.amount),
        date: invoice.createdAt,
      })),

      ...project.proposals.map((proposal) => ({
        id: proposal.id,
        type: "Proposal" as const,
        title: proposal.approved ? "Proposal approved" : "Proposal pending",
        detail: "Project proposal",
        date: proposal.createdAt,
      })),

      ...project.milestones.map((milestone) => ({
        id: milestone.id,
        type: "Milestone" as const,
        title: milestone.title,
        detail: formatStatus(milestone.status),
        date: milestone.dueDate ?? milestone.createdAt,
      })),
    ].sort((left, right) => right.date.getTime() - left.date.getTime());

    const projectFiles = await Promise.all(
      project.files.map(async (file) => ({
        ...file,
        downloadUrl: await getDownloadUrl(file.url),
      })),
    );

    return {
      project,
      timelineItems,
      projectFiles,
      deposits: project.deposits,

      financialSummary: 
        buildProjectFinancialSummary(project),
    };
  };
}

export { getR2DownloadUrl };
