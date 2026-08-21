import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoProjects } from "@/lib/demo/demo-data";

export default function DemoProjectsPage() {
    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Operations
                    </p>

                    <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                        Projects
                    </h1>

                    <p className="mt-3 max-w-3xl text-foreground/60">
                        Track active client work, progress, milestones, and revenue.
                    </p>
                </div>

                <section className="mt-8 grid gap-6 lg:grid-cols-2">
                    {demoProjects.map((project) => {
                        const formattedRevenue =
                            project.outstandingRevenue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            });

                        return (
                            <Link
                                key={project.id}
                                href={`/demo/projects/${project.id}`}
                                className="rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-md sm:p-8"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-foreground/50">
                                            {project.clientName}
                                        </p>

                                        <h2 className="mt-2 text-2xl font-light">
                                            {project.name}
                                        </h2>
                                    </div>

                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                                        {project.status}
                                    </span>
                                </div>

                                <div className="mt-8">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-foreground/50">
                                            Progress
                                        </span>

                                        <span className="font-medium">
                                            {project.progress}%
                                        </span>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{
                                                width: `${project.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-foreground/50">
                                            Next Milestone
                                        </p>

                                        <p className="mt-2 font-medium">
                                            {project.nextMilestone}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-foreground/50">
                                            Outstanding Revenue
                                        </p>

                                        <p className="mt-2 font-medium">
                                            {formattedRevenue}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-7 text-sm font-medium workspace-accent-text">
                                    Open project →
                                </p>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </DemoShell>
    );
}