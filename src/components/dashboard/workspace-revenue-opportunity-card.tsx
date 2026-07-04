import type { WorkspaceRevenueOpportunity } from "@/lib/services/workspace/workspace-revenue-opportunity";

type Props = {
    opportunity: WorkspaceRevenueOpportunity;
};

const urgencyColor = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500",
};

export function WorkspaceRevenueOpportunityCard({
    opportunity,
}: Props) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                        Revenue Opportunity
                    </p>

                    <h2 className="mt-2 text-4xl font-light">
                        ${opportunity.amount.toLocaleString()}
                    </h2>
                </div>

                <div
                    className={`h-3 w-3 rounded-full ${urgencyColor[opportunity.urgency]}`}
                />
            </div>

            <p className="mt-6 text-lg text-foreground/75">
                {opportunity.title}
            </p>

            <div className="mt-8 rounded-2xl bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-foreground/50">
                    Outstanding Invoices
                </p>

                <p className="mt-2 text-2xl font-medium">
                    {opportunity.invoices}
                </p>
            </div>
        </section>
    );
}