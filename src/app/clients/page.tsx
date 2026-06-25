import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

/**
 * Clients page.
 * Lists all clients and their project counts.
 */
export default async function ClientsPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const clients = await prisma.user.findMany({
        where:
            session.user.role === "ADMIN"
                ? {
                    role: "CLIENT",
                }
                : {
                    id: session.user.id,
                    role: "CLIENT",
                },
        include: {
            clientProjects: true,
        },
        orderBy: {
            firstName: "asc",
        },
    });

    return (
        <BrandedDashboardShell>

            <div className="flex items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-light">Clients</h1>

                    <p className="mt-2 text-foreground/70">
                        Manage client relationships, projects, and communication.
                    </p>
                </div>

                <Link
                    href="/clients/new"
                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
                >
                    New Client
                </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {clients.map((client) => (
                    <Link
                        key={client.id}
                        href={`/clients/${client.id}`}
                        className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent"
                    >
                        <h2 className="text-xl font-medium">
                            {client.firstName} {client.lastName}
                        </h2>

                        <p className="mt-2 text-sm text-foreground/60">
                            {client.email}
                        </p>

                        <p className="mt-4 text-sm text-accent">
                            {client.clientProjects.length} Project
                            {client.clientProjects.length !== 1 ? "s" : ""}
                        </p>
                    </Link>
                ))}
            </div>
        </BrandedDashboardShell>
    );
}