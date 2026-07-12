import type { WorkspaceRisk } from "@/lib/services/workspace/workspace-risk";
import { ActionCard } from "@/components/ui/action-card";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
  risks: WorkspaceRisk[];
};

export function WorkspaceRiskCard({
  risks,
}: Props) {
  return (
    <CommandCard
      eyebrow="Operational Risk"
      title="Workspace Risks"
      subtitle="Items requiring executive attention."
      className="h-full"
      actions={
        <StatusBadge
          variant={risks.length === 0 ? "success" : "danger"}
        >
          {risks.length} Active
        </StatusBadge>
      }
    >
      <div className="space-y-4">
        {risks.map((risk) => (
          <ActionCard
            key={risk.title}
            title={risk.title}
            description={risk.description}
            href="/dashboard"
            priority={risk.severity}
          />
        ))}
      </div>
    </CommandCard>
  );
}