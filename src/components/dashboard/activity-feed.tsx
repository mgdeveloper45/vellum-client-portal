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

            <div className="mt-6 grid gap-3">
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

                {activities.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-sm text-foreground/60">
                        No recent activity yet.
                    </div>
                )}
            </div>
        </section>
    );
}