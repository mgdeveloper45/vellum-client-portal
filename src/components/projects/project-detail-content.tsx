import Link from "next/link";
import { formatStatus } from "@/lib/utils";
import { createMessageAction } from "@/actions/message-actions";
import {
    createProjectFileAction,
    deleteProjectFileAction,
} from "@/actions/file-actions";
import {
    createMilestoneAction,
    cycleMilestoneStatusAction,
    deleteMilestoneAction,
} from "@/actions/milestone-actions";
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
            <Link
                href="/projects"
                className="text-sm text-accent"
            >
                ← Back to Projects
            </Link>

            <div className="mt-6 rounded-2xl border border-border bg-card p-8">
                <h1 className="text-4xl font-light">
                    {project.name}
                </h1>

                <p className="mt-4 text-foreground/70">
                    {project.description}
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                        <h2 className="font-medium">
                            Client
                        </h2>

                        <p className="mt-2 text-foreground/70">
                            {project.client.firstName}{" "}
                            {project.client.lastName}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium">
                            Status
                        </h2>

                        <p className="mt-2 text-foreground/70">
                            {formatStatus(project.status)}
                        </p>
                    </div>
                </div>

                <section className="mt-10">
                    <h2 className="text-xl font-medium">
                        Activity Timeline
                    </h2>

                    <div className="mt-4 grid gap-3">
                        {timelineItems.map((item) => (
                            <div
                                key={`${item.type}-${item.id}`}
                                className="rounded-xl border border-border p-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <p className="font-medium">
                                        {item.title}
                                    </p>

                                    <span className="text-xs text-accent">
                                        {item.type}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-foreground/70">
                                    {item.detail}
                                </p>

                                <p className="mt-3 text-xs text-foreground/50">
                                    {item.date.toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-medium">
                        Files
                    </h2>

                    {canManageProject && (
                        <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                            <form
                                action={createProjectFileAction}
                                className="space-y-3"
                                encType="multipart/form-data"
                            >
                                <input
                                    type="hidden"
                                    name="projectId"
                                    value={project.id}
                                />

                                <input
                                    name="file"
                                    type="file"
                                    required
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                                />

                                <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                                    Upload File
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="mt-4 grid gap-3">
                        {projectFiles.map((file) => (
                            <div
                                key={file.id}
                                className="rounded-xl border border-border p-4 transition hover:border-accent"
                            >
                                <p className="font-medium">
                                    {file.name}
                                </p>

                                <p className="mt-1 text-sm text-foreground/60">
                                    {file.fileType}
                                </p>

                                <a
                                    href={file.downloadUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 block text-xs text-accent"
                                >
                                    Open file
                                </a>

                                {canManageProject && (
                                    <form
                                        action={deleteProjectFileAction}
                                        className="mt-3"
                                    >
                                        <input
                                            type="hidden"
                                            name="fileId"
                                            value={file.id}
                                        />

                                        <input
                                            type="hidden"
                                            name="projectId"
                                            value={project.id}
                                        />

                                        <button
                                            aria-label={`Delete file ${file.name}`}
                                            className="text-xs text-red-400"
                                        >
                                            Delete File
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-medium">
                        Milestones
                    </h2>

                    {canManageProject && (
                        <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                            <form
                                action={createMilestoneAction}
                                className="space-y-3"
                            >
                                <input
                                    type="hidden"
                                    name="projectId"
                                    value={project.id}
                                />

                                <input
                                    name="title"
                                    required
                                    placeholder="Milestone title"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                                />

                                <input
                                    name="dueDate"
                                    type="date"
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                                />

                                <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                                    Create Milestone
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="mt-4 grid gap-3">
                        {project.milestones.map(
                            (milestone) => (
                                <div
                                    key={milestone.id}
                                    className="rounded-xl border border-border p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">
                                            {milestone.title}
                                        </h3>

                                        {canManageProject ? (
                                            <form
                                                action={
                                                    cycleMilestoneStatusAction
                                                }
                                            >
                                                <input
                                                    type="hidden"
                                                    name="milestoneId"
                                                    value={milestone.id}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="projectId"
                                                    value={project.id}
                                                />

                                                <button className="text-sm text-accent">
                                                    {formatStatus(
                                                        milestone.status,
                                                    )}
                                                </button>
                                            </form>
                                        ) : (
                                            <span className="text-sm text-foreground/70">
                                                {formatStatus(
                                                    milestone.status,
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    {milestone.dueDate && (
                                        <p className="mt-2 text-sm text-foreground/60">
                                            Due{" "}
                                            {milestone.dueDate.toLocaleDateString()}
                                        </p>
                                    )}

                                    {canManageProject && (
                                        <form
                                            action={deleteMilestoneAction}
                                            className="mt-3"
                                        >
                                            <input
                                                type="hidden"
                                                name="milestoneId"
                                                value={milestone.id}
                                            />

                                            <input
                                                type="hidden"
                                                name="projectId"
                                                value={project.id}
                                            />

                                            <button
                                                aria-label={`Delete milestone ${milestone.title}`}
                                                className="text-xs text-red-400"
                                            >
                                                Delete Milestone
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ),
                        )}
                    </div>
                </section>

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