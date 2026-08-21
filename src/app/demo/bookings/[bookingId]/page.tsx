import Link from "next/link";
import { notFound } from "next/navigation";

import { DemoShell } from "@/components/demo/demo-shell";
import {
    demoBookings,
    demoClients,
    demoProjects,
} from "@/lib/demo/demo-data";

type DemoBookingDetailPageProps = {
    params: Promise<{
        bookingId: string;
    }>;
};

export default async function DemoBookingDetailPage({
    params,
}: DemoBookingDetailPageProps) {
    const { bookingId } = await params;

    const booking = demoBookings.find(
        (candidate) => candidate.id === bookingId,
    );

    if (!booking) {
        notFound();
    }

    const client = demoClients.find(
        (candidate) => candidate.id === booking.clientId,
    );

    const project = booking.projectId
        ? demoProjects.find(
            (candidate) => candidate.id === booking.projectId,
        )
        : null;

    const needsDeposit =
        booking.depositRequired && !booking.depositPaid;

    return (
        <DemoShell>
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/demo/bookings"
                    className="text-sm text-foreground/60 transition hover:text-foreground"
                >
                    ← Back to bookings
                </Link>

                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                            Booking
                        </p>

                        <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
                            {booking.serviceName}
                        </h1>

                        <p className="mt-3 text-foreground/60">
                            {booking.customerName}
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600">
                        {booking.status}
                    </span>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Date
                        </p>

                        <p className="mt-4 text-xl font-medium">
                            {booking.dateLabel}
                        </p>

                        <p className="mt-2 text-sm text-foreground/55">
                            {booking.timeLabel}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Booking Health
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {booking.healthScore}%
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                    width: `${booking.healthScore}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Deposit
                        </p>

                        <p className="mt-4 text-xl font-medium">
                            {!booking.depositRequired
                                ? "Not required"
                                : booking.depositPaid
                                    ? "Paid"
                                    : "Outstanding"}
                        </p>

                        <p className="mt-2 text-sm text-foreground/55">
                            {needsDeposit
                                ? "Follow-up recommended"
                                : "No deposit action needed"}
                        </p>
                    </div>
                </section>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Preparation
                        </p>

                        <h2 className="mt-3 text-2xl font-light">
                            Session Readiness
                        </h2>

                        <div className="mt-8 space-y-4">
                            <div className="rounded-2xl border border-border bg-background p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium">
                                            Client confirmed
                                        </p>

                                        <p className="mt-1 text-sm text-foreground/50">
                                            The session is currently confirmed.
                                        </p>
                                    </div>

                                    <span className="text-sm font-medium text-emerald-600">
                                        Ready
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium">
                                            Deposit
                                        </p>

                                        <p className="mt-1 text-sm text-foreground/50">
                                            {needsDeposit
                                                ? "A required deposit has not been collected."
                                                : "No deposit issue is blocking this booking."}
                                        </p>
                                    </div>

                                    <span
                                        className={
                                            needsDeposit
                                                ? "text-sm font-medium text-amber-600"
                                                : "text-sm font-medium text-emerald-600"
                                        }
                                    >
                                        {needsDeposit ? "Attention" : "Ready"}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium">
                                            Project context
                                        </p>

                                        <p className="mt-1 text-sm text-foreground/50">
                                            {project
                                                ? `Connected to ${project.name}.`
                                                : "This consultation is not yet attached to a project."}
                                        </p>
                                    </div>

                                    <span className="text-sm font-medium workspace-accent-text">
                                        {project ? "Connected" : "Optional"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-3xl border border-border bg-card p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                Client
                            </p>

                            <h2 className="mt-3 text-xl font-medium">
                                {booking.customerName}
                            </h2>

                            {client && (
                                <>
                                    <p className="mt-2 text-sm text-foreground/50">
                                        {client.company}
                                    </p>

                                    <Link
                                        href={`/demo/clients/${client.id}`}
                                        className="mt-6 inline-block text-sm font-medium workspace-accent-text"
                                    >
                                        View client →
                                    </Link>
                                </>
                            )}
                        </section>

                        {project && (
                            <section className="rounded-3xl border border-border bg-card p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                    Project
                                </p>

                                <h2 className="mt-3 text-xl font-medium">
                                    {project.name}
                                </h2>

                                <p className="mt-3 text-sm text-foreground/50">
                                    {project.progress}% complete
                                </p>

                                <Link
                                    href={`/demo/projects/${project.id}`}
                                    className="mt-6 inline-block text-sm font-medium workspace-accent-text"
                                >
                                    Open project →
                                </Link>
                            </section>
                        )}

                        <section className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
                            <p className="font-medium">
                                Booking Command Center
                            </p>

                            <p className="mt-2 text-sm leading-6 text-foreground/60">
                                In a live workspace, booking actions can manage
                                confirmations, preparation, rescheduling, deposits,
                                and connected client activity.
                            </p>

                            <Link
                                href="/sign-in"
                                className="mt-5 inline-block text-sm font-medium workspace-accent-text"
                            >
                                Start using Vellum →
                            </Link>
                        </section>
                    </aside>
                </div>
            </div>
        </DemoShell>
    );
}