import type { TimelineEvent } from "@/lib/services/timeline/timeline-types";
import { CommandCard } from "@/components/ui/command-card";

type Props = {
    events: TimelineEvent[];
};

function getPriorityBadge(priority: string) {
    switch (priority) {
        case "HIGH":
            return "bg-red-100 text-red-700";

        case "MEDIUM":
            return "bg-yellow-100 text-yellow-700";

        default:
            return "bg-green-100 text-green-700";
    }
}

function getEventIcon(type: string) {
    switch (type) {
        case "FINANCE":
            return "💰";

        case "BOOKING":
            return "📅";

        case "CLIENT":
            return "👤";

        case "AUTOMATION":
            return "⚙️";

        case "AI":
            return "🤖";

        default:
            return "📌";
    }
}

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
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">
                                        {getEventIcon(event.type)}
                                    </span>

                                    <h3 className="font-medium">
                                        {event.title}
                                    </h3>
                                </div>

                                <span
                                    className={`rounded-full px-2 py-1 text-xs ${getPriorityBadge(
                                        event.priority,
                                    )}`}
                                >
                                    {event.priority}
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-foreground/70">
                                {event.description}
                            </p>

                            <p className="mt-2 text-xs text-foreground/50">
                                {event.occurredAt.toLocaleDateString()} •{" "}
                                {event.occurredAt.toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </CommandCard>
    );
}