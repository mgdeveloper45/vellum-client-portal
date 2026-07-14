import { prisma } from "@/lib/prisma";
import { getR2DownloadUrl } from "@/lib/r2";
import { formatStatus } from "@/lib/utils";

export async function buildProjectDetail(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      client: true,
      milestones: true,
      invoices: true,
      proposals: true,
      files: true,
      messages: {
        include: {
          sender: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const timelineItems = [
    ...project.messages.map((message) => ({
      id: message.id,
      type: "Message",
      title: `${message.sender.firstName} ${message.sender.lastName} sent a message`,
      detail: message.content,
      date: message.createdAt,
    })),

    ...project.invoices.map((invoice) => ({
      id: invoice.id,
      type: "Invoice",
      title: invoice.paid ? "Invoice paid" : "Invoice created",
      detail: `$${invoice.amount.toLocaleString()}`,
      date: invoice.createdAt,
    })),

    ...project.proposals.map((proposal) => ({
      id: proposal.id,
      type: "Proposal",
      title: proposal.approved ? "Proposal approved" : "Proposal pending",
      detail: "Project proposal",
      date: proposal.createdAt,
    })),

    ...project.milestones.map((milestone) => ({
      id: milestone.id,
      type: "Milestone",
      title: milestone.title,
      detail: formatStatus(milestone.status),
      date: milestone.dueDate ?? milestone.createdAt,
    })),
  ].sort((left, right) => right.date.getTime() - left.date.getTime());

  const projectFiles = await Promise.all(
    project.files.map(async (file) => ({
      ...file,
      downloadUrl: await getR2DownloadUrl(file.url),
    })),
  );

  return {
    project,
    timelineItems,
    projectFiles,
  };
}

export type ProjectDetailViewModel = NonNullable<
  Awaited<ReturnType<typeof buildProjectDetail>>
>;
