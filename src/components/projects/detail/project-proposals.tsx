import {
    createProposalAction,
    deleteProposalAction,
    toggleProposalApprovalAction,
} from "@/actions/proposal-actions";

import type { ProjectDetailViewModel } from "@/lib/services/projects/project-detail-builder";

type ProjectProposalsProps = {
    projectId: string;
    proposals: ProjectDetailViewModel["project"]["proposals"];
    canManageProject: boolean;
};

export function ProjectProposals({
    projectId,
    proposals,
    canManageProject,
}: ProjectProposalsProps) {
    return (
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
                            value={projectId}
                        />

                        <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                            Create Proposal
                        </button>
                    </form>
                </div>
            )}

            <div className="mt-4 grid gap-3">
                {proposals.map((proposal) => (
                    <div
                        key={proposal.id}
                        className="rounded-xl border border-border p-4"
                    >
                        <h3 className="font-medium">
                            Project Proposal
                        </h3>

                        {canManageProject ? (
                            <form
                                action={toggleProposalApprovalAction}
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
                                    value={projectId}
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
                                    value={projectId}
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
                ))}
            </div>
        </section>
    );
}