import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import {
    demoBookings,
    demoClients,
    demoProjects,
} from "@/lib/demo/demo-data";

export default function DemoClientsPage() {
    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Relationships
                    </p>

                    <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                        Clients
                    </h1>

                    <p className="mt-3 max-w-3xl text-foreground/60">
                        Keep client relationships connected to projects, bookings,
                        communication, and revenue.
                    </p>
                </div>

                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    {demoClients.map((client) => {
                        const clientProjects = demoProjects.filter(
                            (project) => project.clientId === client.id,
                        );

                        const clientBookings = demoBookings.filter(
                            (booking) => booking.clientId === client.id,
                        );

                        const outstandingRevenue = clientProjects.reduce(
                            (total, project) =>
                                total + project.outstandingRevenue,
                            0,
                        );

                        return (
                            <Link
                                key={client.id}
                                href={`/demo/clients/${client.id}`}
                                className="rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-medium">
                                            {client.firstName} {client.lastName}
                                        </h2>

                                        <p className="mt-1 text-sm text-foreground/50">
                                            {client.company}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                                        {client.status}
                                    </span>
                                </div>

                                <p className="mt-6 text-sm text-foreground/60">
                                    {client.email}
                                </p>

                                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6">
                                    <div>
                                        <p className="text-xs text-foreground/45">
                                            Projects
                                        </p>

                                        <p className="mt-2 text-lg font-medium">
                                            {clientProjects.length}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-foreground/45">
                                            Bookings
                                        </p>

                                        <p className="mt-2 text-lg font-medium">
                                            {clientBookings.length}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-foreground/45">
                                            Outstanding
                                        </p>

                                        <p className="mt-2 text-lg font-medium">
                                            {outstandingRevenue.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 0,
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-6 text-sm font-medium workspace-accent-text">
                                    View client →
                                </p>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </DemoShell>
    );
}