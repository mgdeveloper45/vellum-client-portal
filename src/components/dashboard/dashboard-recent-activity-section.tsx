import { formatActivityTitle, type ActivityInput } from "@/lib/activity";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";

type Props = {
    recentActivity: (ActivityInput & {
        id: string;
        createdAt: Date;
        user: {
            firstName: string | null;
            lastName: string | null;
        } | null;
    })[];
};

export function DashboardRecentActivitySection({
    recentActivity,
}: Props) {
    return (
        <section className="mt-8 rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">Recent Activity</h2>

            <div className="mt-5 grid gap-3">
                {recentActivity.map((activity) => (
                    <div
                        key={activity.id}
                        className="rounded-2xl border border-border bg-background p-4"
                    >
                        <p className="font-medium">{formatActivityTitle(activity)}</p>

                        <p className="mt-1 text-sm text-foreground/70">
                            {activity.user
                                ? `${activity.user.firstName} ${activity.user.lastName}`
                                : "System"}
                        </p>

                        <p className="mt-2 text-xs text-foreground/50">
                            {activity.entity} · {activity.createdAt.toLocaleString()}
                        </p>
                    </div>
                ))}

                {recentActivity.length === 0 && (
                    <ExecutiveEmptyState
                        title="No recent activity"
                        description="Workspace activity, client updates, bookings, invoices, and automation events will appear here as your business grows."
                        className="min-h-[220px]"
                    />
                )}
            </div>
        </section>
    );
}