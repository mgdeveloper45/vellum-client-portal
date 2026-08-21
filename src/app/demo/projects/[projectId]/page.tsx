import Link from "next/link";
import { notFound } from "next/navigation";

import { DemoShell } from "@/components/demo/demo-shell";
import {
    demoInvoices,
    demoProjects,
} from "@/lib/demo/demo-data";

type DemoProjectDetailPageProps = {
    params: Promise<{
        projectId: string;
    }>;
};

export default async function DemoProjectDetailPage({
    params,
}: DemoProjectDetailPageProps) {
    const { projectId } = await params;

    const project = demoProjects.find(
        (candidate) => candidate.id === projectId,
    );

    if (!project) {
        notFound();
    }

    const projectInvoices = demoInvoices.filter(
        (invoice) => invoice.projectId === project.id,
    );

    const formattedOutstanding =
        project.outstandingRevenue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        });

    const milestones = [
        {
            title: "Discovery",
            status: "COMPLETE",
        },
        {
            title: "Creative Direction",
            status: "COMPLETE",
        },
        {
            title: project.nextMilestone,
            status: "CURRENT",
        },
        {
            title: "Final Delivery",
            status: "UPCOMING",
        },
    ];

    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/demo/projects"
                    className="text-sm text-foreground/60 transition hover:text-foreground"
                >
                    ← Back to projects
                </Link>

                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                            Active Project
                        </p>

                        <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
                            {project.name}
                        </h1>

                        <p className="mt-3 text-foreground/60">
                            {project.clientName}
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600">
                        {project.status}
                    </span>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Progress
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {project.progress}%
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                    width: `${project.progress}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Next Milestone
                        </p>

                        <p className="mt-4 text-xl font-medium">
                            {project.nextMilestone}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Current project focus
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Outstanding Revenue
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {formattedOutstanding}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Across project invoices
                        </p>
                    </div>
                </section>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Project Timeline
                        </p>

                        <h2 className="mt-3 text-2xl font-light">
                            Milestones
                        </h2>

                        <div className="mt-8 space-y-4">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={`${milestone.title}-${index}`}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${milestone.status === "COMPLETE"
                                                    ? "bg-emerald-500/10 text-emerald-600"
                                                    : milestone.status === "CURRENT"
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-muted text-foreground/40"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>

                                        <div>
                                            <p className="font-medium">
                                                {milestone.title}
                                            </p>

                                            <p className="mt-1 text-xs text-foreground/45">
                                                {milestone.status}
                                            </p>
                                        </div>
                                    </div>

                                    {milestone.status === "CURRENT" && (
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                            In progress
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-6">
                        <section className="rounded-3xl border border-border bg-card p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                Client
                            </p>

                            <h2 className="mt-3 text-xl font-medium">
                                {project.clientName}
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-foreground/60">
                                Client communication, approvals, bookings, and project activity
                                stay connected to this workspace.
                            </p>

                            <Link
                                href="/demo/clients"
                                className="mt-6 inline-block text-sm font-medium workspace-accent-text"
                            >
                                Explore clients →
                            </Link>
                        </section>

                        <section className="rounded-3xl border border-border bg-card p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                Finance
                            </p>

                            <h2 className="mt-3 text-xl font-medium">
                                Project Invoices
                            </h2>

                            {projectInvoices.length > 0 ? (
                                <div className="mt-5 space-y-3">
                                    {projectInvoices.map((invoice) => (
                                        <Link
                                            key={invoice.id}
                                            href={`/demo/invoices/${invoice.id}`}
                                            className="block rounded-2xl border border-border bg-background p-4 transition hover:border-primary/40"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="font-medium">
                                                        {invoice.id}
                                                    </p>

                                                    <p className="mt-1 text-xs text-foreground/50">
                                                        {invoice.status}
                                                    </p>
                                                </div>

                                                <p className="font-medium">
                                                    {invoice.amount.toLocaleString("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 0,
                                                    })}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-foreground/60">
                                    No invoices are currently attached to this project.
                                </p>
                            )}

                            <Link
                                href="/demo/invoices"
                                className="mt-6 inline-block text-sm font-medium workspace-accent-text"
                            >
                                View all invoices →
                            </Link>
                        </section>

                        <section className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
                            <p className="font-medium">
                                Connected Workspace
                            </p>

                            <p className="mt-2 text-sm leading-6 text-foreground/60">
                                Vellum connects projects with clients, milestones,
                                communication, bookings, files, and revenue so the full client
                                relationship stays visible.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </DemoShell>
    );
}