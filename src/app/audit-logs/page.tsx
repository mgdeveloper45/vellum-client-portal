import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

export default async function AuditLogsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        return (
            <DashboardShell>
                <p>Only admins can view audit logs.</p>
            </DashboardShell>
        );
    }

    const auditLogs = await prisma.auditLog.findMany({
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 100,
    });

    return (
        <DashboardShell>
            <h1 className="text-3xl font-light">Audit Logs</h1>

            <p className="mt-2 text-foreground/70">
                Review important security and system activity.
            </p>

            <div className="mt-8 grid gap-3">
                {auditLogs.map((log) => (
                    <div
                        key={log.id}
                        className="rounded-2xl border border-border bg-card p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-medium">{log.action}</p>

                                <p className="mt-1 text-sm text-foreground/60">
                                    {typeof log.metadata === "object" &&
                                        log.metadata &&
                                        "name" in log.metadata
                                        ? String(log.metadata.name)
                                        : log.entity}
                                </p>

                                <p className="mt-2 text-sm text-foreground/70">
                                    User:{" "}
                                    {log.user
                                        ? `${log.user.firstName} ${log.user.lastName}`
                                        : "System"}
                                </p>
                            </div>

                            <p className="text-xs text-foreground/50">
                                {log.createdAt.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardShell>
    );
}