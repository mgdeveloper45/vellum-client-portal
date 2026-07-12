import type { WorkspaceMission } from "@/lib/services/workspace/workspace-mission";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ExecutiveCallout } from "@/components/ui/executive-callout";

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
      eyebrow="Today's Mission"
      title={mission.title}
      subtitle="The highest-value objective for today."
      className="h-full"
      actions={
        <StatusBadge variant={badgeVariant[mission.priority]}>
          {mission.priority}
        </StatusBadge>
      }
    >
      <ExecutiveCallout
        title="Executive Recommendation"
        description={mission.description}
      />

      <button className="workspace-accent-button mt-6 w-full rounded-2xl py-3 font-medium transition hover:opacity-90">
        Start Mission
      </button>
    </CommandCard>
  );
}