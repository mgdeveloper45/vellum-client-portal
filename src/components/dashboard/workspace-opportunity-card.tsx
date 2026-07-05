import type { WorkspaceOpportunity } from "@/lib/services/workspace/workspace-opportunity";
import { ActionCard } from "@/components/ui/action-card";
import { CommandCard } from "@/components/ui/command-card";

type Props = {
  opportunities: WorkspaceOpportunity[];
};

export function WorkspaceOpportunityCard({ opportunities }: Props) {
  return (
    <CommandCard
      title="Growth Opportunities"
      subtitle="Ways to increase revenue or engagement"
      actions={
        <div className="rounded-full border border-border bg-background px-4 py-2 text-sm">
          {opportunities.length} Found
        </div>
      }
    >
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <ActionCard
            key={opportunity.title}
            title={opportunity.title}
            description={`${opportunity.description} ${opportunity.valueLabel}`}
            href="/dashboard"
            priority={opportunity.priority}
          />
        ))}
      </div>
    </CommandCard>
  );
}