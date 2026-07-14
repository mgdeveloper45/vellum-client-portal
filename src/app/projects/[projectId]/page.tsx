import { auth } from "@/auth";
import { canManageProjects } from "@/lib/permissions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";
import { buildProjectDetail } from "@/lib/services/projects/project-detail-builder";

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

  const projectDetail =
    await buildProjectDetail(projectId);

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
      timelineItems={
        projectDetail.timelineItems
      }
      projectFiles={
        projectDetail.projectFiles
      }
      canManageProject={canManageProjects(
        session.user.role,
      )}
    />
  );
}