import type { WorkspaceMission } from "@/lib/services/workspace/workspace-mission";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    mission: WorkspaceMission;
};

const badgeVariant = {
    HIGH: "danger",
    MEDIUM: "warning",
    LOW: "success",
} as const;

export function WorkspaceMissionCard({
    mission,
}: Props) {
    return (
        <CommandCard
            title={mission.title}
            subtitle="Today's Mission"
            actions={
                <StatusBadge
                    variant={badgeVariant[mission.priority]}
                >
                    {mission.priority}
                </StatusBadge>
            }
        >
            <p className="text-lg leading-8 text-foreground/75">
                {mission.description}
            </p>

            <button className="workspace-accent-button mt-8 w-full rounded-2xl py-3 font-medium transition hover:opacity-90">
                Start Mission
            </button>
        </CommandCard>
    );
}