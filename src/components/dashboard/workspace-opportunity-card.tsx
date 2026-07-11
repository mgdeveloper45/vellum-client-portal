import type { WorkspaceOpportunity } from "@/lib/services/workspace/workspace-opportunity";
import { ActionCard } from "@/components/ui/action-card";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
  opportunities: WorkspaceOpportunity[];
};

export function WorkspaceOpportunityCard({
  opportunities,
}: Props) {
  return (
    <CommandCard
      eyebrow="Growth"
      title="Revenue Opportunities"
      subtitle="Recommended opportunities to grow the business."
      className="h-full"
      actions={
        <StatusBadge variant="success">
          {opportunities.length} Found
        </StatusBadge>
      }
    >
      {opportunities.length === 0 ? (
        <ExecutiveEmptyState
          title="No growth opportunities yet"
          description="Vellum will automatically surface revenue, retention, and engagement opportunities as your business data grows."
          className="min-h-[220px]"
        />
      ) : (
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
      )}
    </CommandCard>
  );
}