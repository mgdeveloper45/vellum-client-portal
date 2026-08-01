import { ProjectFiles } from "./detail/project-files";
import { ProjectHeader } from "./detail/project-header";
import { ProjectTimeline } from "./detail/project-timeline";
import { ProjectOverview } from "./detail/project-overview";
import { ProjectMilestones } from "./detail/project-milestones";
import { createMessageAction } from "@/actions/message-actions";
import {
    createProposalAction,
    deleteProposalAction,
    toggleProposalApprovalAction,
} from "@/actions/proposal-actions";
import {
    createInvoiceAction,
    deleteInvoiceAction,
    toggleInvoicePaidAction,
} from "@/actions/invoice-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { ProjectDetailViewModel } from "@/lib/services/projects/project-detail-builder";

type ProjectDetailContentProps = {
    project: ProjectDetailViewModel["project"];
    timelineItems: ProjectDetailViewModel["timelineItems"];
    projectFiles: ProjectDetailViewModel["projectFiles"];
    canManageProject: boolean;
};

export function ProjectDetailContent({
    project,
    timelineItems,
    projectFiles,
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

                <ProjectTimeline
                    items={timelineItems}
                />

                <ProjectFiles
                    projectId={project.id}
                    projectFiles={projectFiles}
                    canManageProject={canManageProject}
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

                <section className="mt-10">
                    <h2 className="text-xl font-medium">
                        Messages
                    </h2>

                    <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                        <form
                            action={createMessageAction}
                            className="space-y-3"
                        >
                            <input
                                type="hidden"
                                name="projectId"
                                value={project.id}
                            />

                            <textarea
                                name="content"
                                required
                                placeholder="Write a message..."
                                className="min-h-24 w-full rounded-lg border border-border bg-background px-4 py-3"
                            />

                            <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="mt-4 grid gap-3">
                        {project.messages.map((message) => (
                            <div
                                key={message.id}
                                className="rounded-xl border border-border p-4"
                            >
                                <p className="text-sm font-medium">
                                    {message.sender.firstName}{" "}
                                    {message.sender.lastName}
                                </p>

                                <p className="text-xs text-foreground/50">
                                    {message.sender.role}
                                </p>

                                <p className="mt-3 text-sm leading-6 text-foreground/70">
                                    {message.content}
                                </p>

                                <p className="mt-3 text-xs text-foreground/50">
                                    Sent{" "}
                                    {message.createdAt.toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-medium">
                        Invoices
                    </h2>

                    {canManageProject && (
                        <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                            <form
                                action={createInvoiceAction}
                                className="space-y-3"
                            >
                                <input
                                    type="hidden"
                                    name="projectId"
                                    value={project.id}
                                />

                                <input
                                    name="amount"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    required
                                    placeholder="Invoice amount"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                                />

                                <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                                    Create Invoice
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="mt-4 grid gap-3">
                        {project.invoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="rounded-xl border border-border p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                        $
                                        {invoice.amount.toLocaleString()}
                                    </p>

                                    {canManageProject ? (
                                        <form
                                            action={
                                                toggleInvoicePaidAction
                                            }
                                        >
                                            <input
                                                type="hidden"
                                                name="invoiceId"
                                                value={invoice.id}
                                            />

                                            <input
                                                type="hidden"
                                                name="projectId"
                                                value={project.id}
                                            />

                                            <button className="text-sm text-accent">
                                                {invoice.paid
                                                    ? "Paid"
                                                    : "Mark Paid"}
                                            </button>
                                        </form>
                                    ) : (
                                        <span className="text-sm text-foreground/70">
                                            {invoice.paid
                                                ? "Paid"
                                                : "Unpaid"}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-xs text-foreground/50">
                                    Created{" "}
                                    {invoice.createdAt.toLocaleDateString()}
                                </p>

                                {canManageProject && (
                                    <form
                                        action={deleteInvoiceAction}
                                        className="mt-3"
                                    >
                                        <input
                                            type="hidden"
                                            name="invoiceId"
                                            value={invoice.id}
                                        />

                                        <input
                                            type="hidden"
                                            name="projectId"
                                            value={project.id}
                                        />

                                        <button
                                            aria-label={`Delete invoice for $${invoice.amount}`}
                                            className="text-xs text-red-400"
                                        >
                                            Delete Invoice
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-medium">
                        Proposals
                    </h2>

                    {canManageProject && (
                        <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                            <form
                                action={createProposalAction}
                                className="space-y-3"
                            >
                                <input
                                    type="hidden"
                                    name="projectId"
                                    value={project.id}
                                />

                                <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                                    Create Proposal
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="mt-4 grid gap-3">
                        {project.proposals.map(
                            (proposal) => (
                                <div
                                    key={proposal.id}
                                    className="rounded-xl border border-border p-4"
                                >
                                    <h3 className="font-medium">
                                        Project Proposal
                                    </h3>

                                    {canManageProject ? (
                                        <form
                                            action={
                                                toggleProposalApprovalAction
                                            }
                                            className="mt-2"
                                        >
                                            <input
                                                type="hidden"
                                                name="proposalId"
                                                value={proposal.id}
                                            />

                                            <input
                                                type="hidden"
                                                name="projectId"
                                                value={project.id}
                                            />

                                            <button className="text-sm text-accent">
                                                {proposal.approved
                                                    ? "Approved"
                                                    : "Approve Proposal"}
                                            </button>
                                        </form>
                                    ) : (
                                        <p className="mt-2 text-sm text-foreground/70">
                                            {proposal.approved
                                                ? "Approved"
                                                : "Pending"}
                                        </p>
                                    )}

                                    <p className="mt-2 text-xs text-foreground/50">
                                        Created{" "}
                                        {proposal.createdAt.toLocaleDateString()}
                                    </p>

                                    {canManageProject && (
                                        <form
                                            action={deleteProposalAction}
                                            className="mt-3"
                                        >
                                            <input
                                                type="hidden"
                                                name="proposalId"
                                                value={proposal.id}
                                            />

                                            <input
                                                type="hidden"
                                                name="projectId"
                                                value={project.id}
                                            />

                                            <button
                                                aria-label="Delete proposal"
                                                className="text-xs text-red-400"
                                            >
                                                Delete Proposal
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ),
                        )}
                    </div>
                </section>
            </div>
        </DashboardShell>
    );
}