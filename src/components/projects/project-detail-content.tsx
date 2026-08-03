import { ProjectFiles } from "./detail/project-files";
import { ProjectHeader } from "./detail/project-header";
import { ProjectMessages } from "./detail/project-messages";
import { ProjectTimeline } from "./detail/project-timeline";
import { ProjectInvoices } from "./detail/project-invoices";
import { ProjectOverview } from "./detail/project-overview";
import { ProjectProposals } from "./detail/project-proposals";
import { ProjectMilestones } from "./detail/project-milestones";
import { ProjectDeposits } from "./detail/project-deposits";
import { ProjectFinancialSummary } from "./detail/project-financial-summary";
import { RequestDepositForm } from "./detail/request-deposit-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { ProjectDetailViewModel } from "@/lib/services/projects/project-detail-builder";

type ProjectDetailContentProps = {
    project: ProjectDetailViewModel["project"];
    timelineItems: ProjectDetailViewModel["timelineItems"];
    projectFiles: ProjectDetailViewModel["projectFiles"];
    deposits: ProjectDetailViewModel["deposits"];
    financialSummary:
    ProjectDetailViewModel["financialSummary"];
    canManageProject: boolean;
};

export function ProjectDetailContent({
    project,
    timelineItems,
    projectFiles,
    deposits,
    financialSummary,
    canManageProject,
}: ProjectDetailContentProps) {
    return (
        <DashboardShell>
            <ProjectHeader
                name={project.name}
                description={project.description}
            />

            <div className="mt-6 rounded-2xl border border-border bg-card p-8">
                <ProjectOverview
                    clientName={`${project.client.firstName} ${project.client.lastName}`}
                    status={project.status}
                />

                <ProjectFinancialSummary
                    {...financialSummary}
                />

                <ProjectTimeline
                    items={timelineItems}
                />

                <ProjectFiles
                    projectId={project.id}
                    projectFiles={projectFiles}
                    canManageProject={canManageProject}
                />

                <ProjectMilestones
                    projectId={project.id}
                    milestones={project.milestones}
                    canManageProject={canManageProject}
                />

                {canManageProject && (
                    <RequestDepositForm
                        projectId={project.id}
                    />
                )}

                <ProjectDeposits
                    deposits={deposits}
                />

                <ProjectMessages
                    projectId={project.id}
                    messages={project.messages}
                />

                <ProjectInvoices
                    projectId={project.id}
                    invoices={project.invoices}
                    canManageProject={canManageProject}
                />

                <ProjectProposals
                    projectId={project.id}
                    proposals={project.proposals}
                    canManageProject={canManageProject}
                />

            </div>
        </DashboardShell>
    );
}