import type { WorkspaceRisk } from "@/lib/services/workspace/workspace-risk";
import { ActionCard } from "@/components/ui/action-card";
import { CommandCard } from "@/components/ui/command-card";

type Props = {
  risks: WorkspaceRisk[];
};

export function WorkspaceRiskCard({ risks }: Props) {
  return (
    <CommandCard
      title="Workspace Risks"
      subtitle="Items that may need attention"
      actions={
        <div className="rounded-full border border-border bg-background px-4 py-2 text-sm">
          {risks.length} Active
        </div>
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