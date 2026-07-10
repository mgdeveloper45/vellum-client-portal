import type { WorkspaceMission } from "@/lib/services/workspace/workspace-mission";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveButton } from "@/components/ui/executive-button";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    mission: WorkspaceMission;
};

const badgeVariant = {
    HIGH: "danger",
    MEDIUM: "warning",
    LOW: "success",
} as const;

export function WorkspaceMissionCard({ mission }: Props) {
    return (
        <CommandCard
            eyebrow="Today’s Mission"
            title={mission.title}
            subtitle="The highest-impact action for your workspace today."
            actions={
                <StatusBadge variant={badgeVariant[mission.priority]}>
                    {mission.priority}
                </StatusBadge>
            }
            className="h-full"
        >
            <div className="flex h-full flex-col">
                <p className="text-lg font-light leading-8 text-foreground/75">
                    {mission.description}
                </p>

                <div className="mt-auto pt-8">
                    <ExecutiveButton size="lg" fullWidth>
                        Start Mission
                    </ExecutiveButton>
                </div>
            </div>
        </CommandCard>
    );
}