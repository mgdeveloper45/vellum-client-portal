import type { WorkspaceRisk } from "@/lib/services/workspace/workspace-risk";
import { ActionCard } from "@/components/ui/action-card";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
  risks: WorkspaceRisk[];
};

export function WorkspaceRiskCard({ risks }: Props) {
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
      {risks.length === 0 ? (
        <ExecutiveEmptyState
          title="No active risks"
          description="Your workspace is operating smoothly. New operational risks will appear here when attention is required."
          className="min-h-[220px]"
        />
      ) : (
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
      )}
    </CommandCard>
  );
}