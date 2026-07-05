import type { ExecutiveInboxItem } from "@/lib/services/intelligence/executive-inbox";
import { ActionCard } from "@/components/ui/action-card";
import { CommandCard } from "@/components/ui/command-card";

type Props = {
    items: ExecutiveInboxItem[];
};

export function ExecutiveInboxCard({ items }: Props) {
    return (
        <CommandCard
            title="Prioritized Work"
            subtitle="Executive Inbox"
            actions={
                <div className="rounded-full border border-border bg-background px-4 py-2 text-sm">
                    {items.length} Items
                </div>
            }
        >
            <div className="space-y-4">
                {items.map((item) => (
                    <ActionCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        href={item.href}
                        priority={item.priority}
                    />
                ))}
            </div>
        </CommandCard>
    );
}