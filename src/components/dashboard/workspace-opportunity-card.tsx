import type { WorkspaceOpportunity } from "@/lib/services/workspace/workspace-opportunity";

type Props = {
  opportunities: WorkspaceOpportunity[];
};

const priorityColors = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-yellow-500",
  LOW: "bg-green-500",
};

export function WorkspaceOpportunityCard({
  opportunities,
}: Props) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light">
          Growth Opportunities
        </h2>

        <span className="text-sm text-foreground/50">
          {opportunities.length} Found
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.title}
            className="rounded-2xl border border-border bg-background p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {opportunity.title}
              </p>

              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  priorityColors[opportunity.priority]
                }`}
              />
            </div>

            <p className="mt-2 text-sm text-foreground/70">
              {opportunity.description}
            </p>

            <p className="mt-3 text-lg font-semibold">
              {opportunity.valueLabel}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}