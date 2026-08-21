import Link from "next/link";
import { notFound } from "next/navigation";

import { DemoShell } from "@/components/demo/demo-shell";
import {
    demoBookings,
    demoClients,
    demoMessages,
    demoProjects,
} from "@/lib/demo/demo-data";

type DemoClientDetailPageProps = {
    params: Promise<{
        clientId: string;
    }>;
};

export default async function DemoClientDetailPage({
    params,
}: DemoClientDetailPageProps) {
    const { clientId } = await params;

    const client = demoClients.find(
        (candidate) => candidate.id === clientId,
    );

    if (!client) {
        notFound();
    }

    const projects = demoProjects.filter(
        (project) => project.clientId === client.id,
    );

    const bookings = demoBookings.filter(
        (booking) => booking.clientId === client.id,
    );

    const projectNames = new Set(
        projects.map((project) => project.name),
    );

    const messages = demoMessages.filter((message) =>
        projectNames.has(message.projectName),
    );

    const outstandingRevenue = projects.reduce(
        (total, project) =>
            total + project.outstandingRevenue,
        0,
    );

    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/demo/clients"
                    className="text-sm text-foreground/60 transition hover:text-foreground"
                >
                    ← Back to clients
                </Link>

                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                            Client Relationship
                        </p>

                        <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
                            {client.firstName} {client.lastName}
                        </h1>

                        <p className="mt-3 text-foreground/60">
                            {client.company}
                        </p>

                        <p className="mt-1 text-sm text-foreground/45">
                            {client.email}
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600">
                        {client.status}
                    </span>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Projects
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {projects.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Bookings
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {bookings.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Outstanding Revenue
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {outstandingRevenue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            })}
                        </p>
                    </div>
                </section>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                    <section className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Projects
                        </p>

                        <h2 className="mt-3 text-2xl font-light">
                            Client Work
                        </h2>

                        <div className="mt-6 space-y-3">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/demo/projects/${project.id}`}
                                        className="block rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-medium">
                                                    {project.name}
                                                </p>

                                                <p className="mt-1 text-sm text-foreground/50">
                                                    {project.progress}% complete
                                                </p>
                                            </div>

                                            <span className="text-sm workspace-accent-text">
                                                Open →
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-foreground/60">
                                    No projects are currently connected to this client.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Bookings
                        </p>

                        <h2 className="mt-3 text-2xl font-light">
                            Scheduled Activity
                        </h2>

                        <div className="mt-6 space-y-3">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="rounded-2xl border border-border bg-background p-5"
                                    >
                                        <p className="font-medium">
                                            {booking.serviceName}
                                        </p>

                                        <p className="mt-2 text-sm text-foreground/50">
                                            {booking.dateLabel} · {booking.timeLabel}
                                        </p>

                                        <p className="mt-2 text-xs font-medium text-emerald-600">
                                            {booking.status}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-foreground/60">
                                    No bookings are currently scheduled for this client.
                                </p>
                            )}
                        </div>

                        <Link
                            href="/demo/bookings"
                            className="mt-6 inline-block text-sm font-medium workspace-accent-text"
                        >
                            Explore bookings →
                        </Link>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6 xl:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Communication
                        </p>

                        <h2 className="mt-3 text-2xl font-light">
                            Recent Messages
                        </h2>

                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                            {messages.length > 0 ? (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="rounded-2xl border border-border bg-background p-5"
                                    >
                                        <p className="font-medium">
                                            {message.projectName}
                                        </p>

                                        <p className="mt-3 text-sm leading-6 text-foreground/60">
                                            {message.preview}
                                        </p>

                                        <p className="mt-3 text-xs text-foreground/40">
                                            {message.timeLabel}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-foreground/60">
                                    No recent project messages for this client.
                                </p>
                            )}
                        </div>

                        <Link
                            href="/demo/messages"
                            className="mt-6 inline-block text-sm font-medium workspace-accent-text"
                        >
                            Explore messages →
                        </Link>
                    </section>
                </div>
            </div>
        </DemoShell>
    );
}