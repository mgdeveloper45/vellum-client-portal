import type { ExecutiveInboxItem } from "@/lib/services/intelligence/executive-inbox";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    items: ExecutiveInboxItem[];
};

const priorityVariant = {
    CRITICAL: "danger",
    HIGH: "warning",
    MEDIUM: "info",
    LOW: "success",
} as const;

function countPriority(
    items: ExecutiveInboxItem[],
    priority: ExecutiveInboxItem["priority"],
) {
    return items.filter((item) => item.priority === priority).length;
}

export function ExecutiveInboxCard({
    items,
}: Props) {
    const critical = countPriority(items, "CRITICAL");
    const high = countPriority(items, "HIGH");

    return (
        <CommandCard
            eyebrow="Executive Inbox"
            title="Prioritized Work"
            subtitle="Your highest-impact actions for today."
            actions={
                <StatusBadge
                    variant={
                        critical > 0
                            ? "danger"
                            : high > 0
                                ? "warning"
                                : "success"
                    }
                >
                    {items.length} Open
                </StatusBadge>
            }
        >
            <div className="mb-6 flex flex-wrap gap-3">
                <StatusBadge variant="danger">
                    {critical} Critical
                </StatusBadge>

                <StatusBadge variant="warning">
                    {high} High
                </StatusBadge>

                <StatusBadge variant="info">
                    {items.length} Open
                </StatusBadge>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-border/60 bg-background/50 p-1 transition-colors hover:border-primary/20"
                    >
                        <div className="mb-3 flex items-center justify-between px-3 pt-3">
                            <StatusBadge
                                variant={
                                    priorityVariant[item.priority]
                                }
                            >
                                {item.priority}
                            </StatusBadge>
                        </div>

                        <RecommendationCard
                            title={item.title}
                            description={item.description}
                            href={item.href}
                            priority={item.priority}
                        />
                    </div>
                ))}
            </div>
        </CommandCard>
    );
}
