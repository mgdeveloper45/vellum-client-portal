import type { TimelineEvent } from "@/lib/services/timeline/timeline-types";
import { CommandCard } from "@/components/ui/command-card";

type Props = {
    events: TimelineEvent[];
};

export function ExecutiveTimelineCard({
    events,
}: Props) {
    return (
        <CommandCard
            title="Executive Timeline"
            subtitle="Recent business activity"
        >
            <div className="space-y-4">
                {events.length === 0 ? (
                    <p className="text-foreground/60">
                        No recent activity.
                    </p>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className="rounded-xl border border-border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    {event.title}
                                </h3>

                                <span className="text-xs text-foreground/50">
                                    {event.priority}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-foreground/70">
                                {event.description}
                            </p>

                            <p className="mt-2 text-xs text-foreground/50">
                                {event.occurredAt.toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </CommandCard>
    );
}