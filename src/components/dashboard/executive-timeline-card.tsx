import type { TimelineEvent } from "@/lib/services/timeline/timeline-types";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    events: TimelineEvent[];
};

const priorityVariant = {
    CRITICAL: "danger",
    HIGH: "warning",
    MEDIUM: "info",
    LOW: "success",
} as const;

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

function getDayLabel(date: Date) {
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
}

export function ExecutiveTimelineCard({
    events,
}: Props) {
    if (events.length === 0) {
        return (
            <CommandCard
                eyebrow="Executive Timeline"
                title="Business Activity"
                subtitle="Recent business events"
            >
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-foreground/60">
                    No recent activity.
                </div>
            </CommandCard>
        );
    }

    const groupedEvents = events.reduce<
        {
            label: string;
            events: TimelineEvent[];
        }[]
    >((groups, event) => {
        const label = getDayLabel(event.occurredAt);

        const lastGroup = groups[groups.length - 1];

        if (!lastGroup || lastGroup.label !== label) {
            groups.push({
                label,
                events: [event],
            });
        } else {
            lastGroup.events.push(event);
        }

        return groups;
    }, []);

    return (
        <CommandCard
            eyebrow="Executive Timeline"
            title="Business Activity"
            subtitle="A chronological view of recent operational events."
        >
            <div className="space-y-8">
                {groupedEvents.map((group) => (
                    <section key={group.label}>
                        <div className="mb-4 border-b border-border pb-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                {group.label}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {group.events.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex gap-4 rounded-2xl border border-border/60 bg-background/60 p-5"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background text-lg">
                                        {getEventIcon(event.type)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <h3 className="font-medium">
                                                {event.title}
                                            </h3>

                                            <StatusBadge
                                                variant={
                                                    priorityVariant[
                                                    event.priority
                                                    ]
                                                }
                                            >
                                                {event.priority}
                                            </StatusBadge>
                                        </div>

                                        <p className="mt-2 text-sm leading-6 text-foreground/70">
                                            {event.description}
                                        </p>

                                        <p className="mt-3 text-xs text-foreground/50">
                                            {event.occurredAt.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                },
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </CommandCard>
    );
}