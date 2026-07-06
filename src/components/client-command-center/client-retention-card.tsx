import { CommandCard } from "@/components/ui/command-card";

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
            subtitle={`Risk: ${risk}`}
        >
            <p className="text-foreground/70">
                {recommendedAction}
            </p>
        </CommandCard>
    );
}