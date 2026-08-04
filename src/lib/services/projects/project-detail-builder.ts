import { getR2DownloadUrl } from "@/lib/r2";
import { formatStatus } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import type {
  ProjectDetailRecord,
  ProjectRepository,
} from "./project-repository";
import { buildDepositViewModel } from "@/lib/services/deposit-payments/deposit-view-model-builder";
import type { DepositPaymentRepository } from "@/lib/services/deposit-payments/deposit-payment-repository";
import type { DepositViewModel } from "@/lib/services/deposit-payments/deposit-view-model";

export interface BuildProjectDetailRequest {
  workspaceId: string;
  projectId: string;
  viewerUserId: string;
  canManageProjects: boolean;
}

export interface ProjectTimelineItem {
  id: string;
  type:
    "Message" | "Invoice" | "Proposal" | "Milestone" | "Deposit" | "Payment";
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
  depositViewModels: DepositViewModel[];

  financialSummary: {
    depositTotal: number;
    invoiceTotal: number;
    outstandingBalance: number;
  };
}

interface ProjectDetailBuilderDependencies {
  projectRepository: ProjectRepository;
  depositPaymentRepository: DepositPaymentRepository;
  getDownloadUrl: (objectKey: string) => Promise<string>;
}

export function createProjectDetailBuilder({
  projectRepository,
  depositPaymentRepository,
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

    const depositViewModels = project.deposits.map((deposit) =>
      buildDepositViewModel({
        deposit,
        payments: paymentsByDepositId.get(deposit.id) ?? [],
      }),
    );

    const depositTotal = depositViewModels.reduce(
      (sum, deposit) => sum + deposit.amount,
      0,
    );

    const invoiceTotal = project.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount),
      0,
    );

    const outstandingBalance =
      depositViewModels.reduce(
        (sum, deposit) => sum + deposit.financialSummary.remainingBalance,
        0,
      ) +
      project.invoices
        .filter((invoice) => !invoice.paid)
        .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

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

      ...depositViewModels.map((deposit) => ({
        id: `deposit-${deposit.id}`,
        type: "Deposit" as const,
        title: "Deposit requested",
        detail: formatMoney(deposit.amount),
        date: deposit.requestedAt,
      })),

      ...depositViewModels.flatMap((deposit) =>
        deposit.payments.map((payment) => ({
          id: `payment-${payment.id}`,
          type: "Payment" as const,
          title: "Payment received",
          detail: `${formatMoney(payment.amount)} • ${payment.paymentMethod.replaceAll("_", " ")}`,
          date: payment.receivedAt,
        })),
      ),

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

    const depositPayments = await depositPaymentRepository.listByProject(
      project.id,
    );

    const paymentsByDepositId = new Map<string, typeof depositPayments>();

    for (const payment of depositPayments) {
      const existingPayments = paymentsByDepositId.get(payment.depositId) ?? [];

      existingPayments.push(payment);

      paymentsByDepositId.set(payment.depositId, existingPayments);
    }

    return {
      project,
      timelineItems,
      projectFiles,
      depositViewModels,

      financialSummary: {
        depositTotal,
        invoiceTotal,
        outstandingBalance,
      },
    };
  };
}

export { getR2DownloadUrl };
