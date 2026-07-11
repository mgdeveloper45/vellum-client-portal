import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";

type ActivityItem = {
    id: string;
    title: string;
    message: string;
    type: string | null;
    href: string | null;
    createdAt: Date;
};

type ActivityFeedProps = {
    activities: ActivityItem[];
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">Recent Activity</h2>

            <p className="mt-1 text-sm text-foreground/60">
                Latest booking and workspace updates.
            </p>

            <div className="mt-6">
                {activities.length === 0 ? (
                    <ExecutiveEmptyState
                        title="No notifications yet"
                        description="Booking updates, workspace alerts, and important notifications will appear here."
                        className="min-h-[220px]"
                    />
                ) : (
                    <div className="grid gap-3">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="rounded-2xl border border-border bg-background p-4"
                            >
                                <p className="font-medium">{activity.title}</p>

                                <p className="mt-1 text-sm text-foreground/70">
                                    {activity.message}
                                </p>

                                <p className="mt-3 text-xs text-foreground/50">
                                    {activity.createdAt.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}