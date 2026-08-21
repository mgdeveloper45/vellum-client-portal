import Link from "next/link";
import { DemoShell } from "@/components/demo/demo-shell";

const metrics = [
    {
        label: "Active Projects",
        value: "2",
        detail: "Both progressing normally",
    },
    {
        label: "Today's Bookings",
        value: "1",
        detail: "Next consultation at 10:00 AM",
    },
    {
        label: "Outstanding Revenue",
        value: "$2,500",
        detail: "1 invoice ready for follow-up",
    },
    {
        label: "Workspace Health",
        value: "92",
        detail: "Operating normally",
    },
];

const actions = [
    {
        title: "Review outstanding invoice",
        description:
            "A client payment is ready for follow-up.",
        href: "/demo/invoices",
        priority: "HIGH",
    },
    {
        title: "Prepare upcoming booking",
        description:
            "Review the next consultation before it begins.",
        href: "/demo/bookings",
        priority: "MEDIUM",
    },
    {
        title: "Review active projects",
        description:
            "Check milestones, approvals, files, and client activity.",
        href: "/demo/projects",
        priority: "LOW",
    },
];

export default function DemoPage() {
    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                            Executive Brief
                        </p>

                        <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                            Good morning. Here&apos;s what needs your attention.
                        </h1>

                        <p className="mt-3 max-w-3xl text-foreground/60">
                            Explore a sample creative-services workspace and see how Vellum
                            brings bookings, projects, clients, and revenue into one
                            operating system.
                        </p>
                    </div>

                    <span className="w-fit rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-2 text-sm text-primary">
                        Demo Workspace
                    </span>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="rounded-3xl border border-border bg-card p-6"
                        >
                            <p className="text-sm text-foreground/50">
                                {metric.label}
                            </p>

                            <p className="mt-4 text-3xl font-light">
                                {metric.value}
                            </p>

                            <p className="mt-3 text-sm text-foreground/55">
                                {metric.detail}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Today&apos;s Mission
                        </p>

                        <h2 className="mt-3 text-2xl font-light">
                            Collect the outstanding client payment
                        </h2>

                        <p className="mt-3 max-w-2xl leading-7 text-foreground/60">
                            One active project has an unpaid $2,500 invoice. Review the
                            invoice and see how Vellum helps move revenue toward collection.
                        </p>

                        <Link
                            href="/demo/invoices"
                            className="workspace-accent-button mt-8 inline-block rounded-2xl px-6 py-3 font-medium"
                        >
                            Start Mission
                        </Link>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Business Health
                        </p>

                        <div className="mt-4 flex items-end gap-3">
                            <span className="text-5xl font-light">92</span>
                            <span className="pb-1 text-sm text-foreground/45">
                                / 100
                            </span>
                        </div>

                        <p className="mt-4 leading-7 text-foreground/60">
                            Projects are active, bookings are scheduled, and the primary
                            opportunity is collecting outstanding revenue.
                        </p>
                    </div>
                </section>

                <section className="mt-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Recommended Actions
                        </p>

                        <h2 className="mt-2 text-2xl font-light">
                            What Vellum would surface next
                        </h2>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                        {actions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-medium">
                                        {action.title}
                                    </h3>

                                    <span className="rounded-full bg-muted px-3 py-1 text-xs">
                                        {action.priority}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-foreground/60">
                                    {action.description}
                                </p>

                                <p className="mt-6 text-sm font-medium workspace-accent-text">
                                    Explore →
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </DemoShell>
    );
}