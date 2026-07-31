import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "../ui/status-badge";

type Props = {
    risk: string;
    recommendedAction: string;
};

export function ClientRetentionCard({
    risk,
    recommendedAction,
}: Props) {
    return (
        <CommandCard
            title="Retention"
            subtitle="Client retention outlook"
        >
            <StatusBadge variant="warning">
                {risk}
            </StatusBadge>
            <p className="text-foreground/70">
                {recommendedAction}
            </p>
        </CommandCard>
    );
}