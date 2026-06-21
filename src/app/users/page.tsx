import Link from "next/link";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        return (
            <DashboardShell>
                <p>Only admins can manage users.</p>
            </DashboardShell>
        );
    }

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <DashboardShell>
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-light">Users</h1>

                    <p className="mt-2 text-foreground/70">
                        Manage admin and client accounts.
                    </p>
                </div>

                <Link
                    href="/users/new"
                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
                >
                    New User
                </Link>
            </div>

            <div className="mt-8 grid gap-4">
                {users.map((user) => (
                    <Link
                        key={user.id}
                        href={`/users/${user.id}/edit`}
                        className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-medium">
                                    {user.firstName} {user.lastName}
                                </h2>

                                <p className="mt-1 text-sm text-foreground/60">
                                    {user.email}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-accent">{user.role}</p>

                                <p className="mt-1 text-xs text-foreground/50">
                                    {user.isActive ? "Active" : "Inactive"}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </DashboardShell>
    );
}