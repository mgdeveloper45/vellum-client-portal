import Link from "next/link";

import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { buildProjectDetail } from "@/lib/services/projects/composition/project-services";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const { projectId } = await params;

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return null;
  }

  const userCanManageProjects = canManageProjects(
    session.user.role,
  );

  const projectDetail = await buildProjectDetail({
    workspaceId,
    projectId,
    viewerUserId: session.user.id,
    canManageProjects: userCanManageProjects,
  });

  if (!projectDetail) {
    return (
      <DashboardShell>
        <ExecutiveEmptyState
          title="Project not found"
          description="This project doesn't exist or you don't have permission to view it."
          action={
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Back to Projects
            </Link>
          }
          className="min-h-[420px]"
        />
      </DashboardShell>
    );
  }

  return (
    <ProjectDetailContent
      project={projectDetail.project}
      timelineItems={projectDetail.timelineItems}
      projectFiles={projectDetail.projectFiles}
      depositViewModels={projectDetail.depositViewModels}
      financialSummary={projectDetail.financialSummary}
      canManageProject={userCanManageProjects}
    />
  );
}