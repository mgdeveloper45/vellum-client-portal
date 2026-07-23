import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";
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
        <h1 className="text-2xl font-light">
          Project not found
        </h1>
      </DashboardShell>
    );
  }

  return (
    <ProjectDetailContent
      project={projectDetail.project}
      timelineItems={projectDetail.timelineItems}
      projectFiles={projectDetail.projectFiles}
      canManageProject={userCanManageProjects}
    />
  );
}