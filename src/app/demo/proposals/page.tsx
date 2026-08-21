import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoProposals } from "@/lib/demo/demo-data";

const statusClasses = {
    PENDING: "bg-amber-500/10 text-amber-600",
} as const;

export default function DemoProposalsPage() {
    const pipelineValue = demoProposals.reduce(
        (total, proposal) => total + proposal.amount,
        0,
    );

    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Finance
                    </p>

                    <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                        Proposals
                    </h1>

                    <p className="mt-3 max-w-3xl text-foreground/60">
                        Track client proposals, pending approvals, and potential revenue
                        before work becomes an active project.
                    </p>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Pipeline Value
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {pipelineValue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            })}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Potential project revenue
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Pending
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {
                                demoProposals.filter(
                                    (proposal) => proposal.status === "PENDING",
                                ).length
                            }
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Awaiting client decision
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Conversion Opportunity
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            High
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Follow-up recommended
                        </p>
                    </div>
                </section>

                <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
                    <div className="border-b border-border px-6 py-5">
                        <h2 className="text-xl font-medium">
                            Proposal Pipeline
                        </h2>

                        <p className="mt-1 text-sm text-foreground/50">
                            Opportunities waiting to become active client work.
                        </p>
                    </div>

                    <div className="divide-y divide-border">
                        {demoProposals.map((proposal) => {
                            const formattedAmount = proposal.amount.toLocaleString(
                                "en-US",
                                {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                },
                            );

                            return (
                                <div
                                    key={proposal.id}
                                    className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="font-medium">
                                                {proposal.clientName}
                                            </p>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[
                                                    proposal.status as keyof typeof statusClasses
                                                    ]
                                                    }`}
                                            >
                                                {proposal.status}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-lg">
                                            {proposal.projectName}
                                        </p>

                                        <p className="mt-2 text-sm text-foreground/50">
                                            Client approval is the next step.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <p className="text-2xl font-light">
                                            {formattedAmount}
                                        </p>

                                        <Link
                                            href="/sign-in"
                                            className="workspace-accent-button rounded-2xl px-5 py-3 text-center text-sm font-medium"
                                        >
                                            Sign in to manage
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
                    <p className="font-medium">
                        Turn proposals into active work
                    </p>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
                        In a live Vellum workspace, approved proposals can move into the
                        project workflow while keeping the client, scope, and financial
                        context connected.
                    </p>

                    <Link
                        href="/demo/projects"
                        className="mt-4 inline-block text-sm font-medium workspace-accent-text"
                    >
                        Explore active projects →
                    </Link>
                </section>
            </div>
        </DemoShell>
    );
}