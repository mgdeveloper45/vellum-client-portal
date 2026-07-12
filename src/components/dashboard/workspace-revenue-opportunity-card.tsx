import type { WorkspaceRevenueOpportunity } from "@/lib/services/workspace/workspace-revenue-opportunity";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveCallout } from "@/components/ui/executive-callout";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    opportunity: WorkspaceRevenueOpportunity;
};

const badgeVariant = {
    HIGH: "danger",
    MEDIUM: "warning",
    LOW: "success",
} as const;

export function WorkspaceRevenueOpportunityCard({
    opportunity,
}: Props) {
    const formattedAmount = opportunity.amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

    const description =
        opportunity.invoices > 0
            ? `${opportunity.invoices} outstanding ${opportunity.invoices === 1 ? "invoice" : "invoices"
            } could recover ${formattedAmount}.`
            : "No outstanding invoices currently require collection.";

    return (
        <CommandCard
            eyebrow="Revenue"
            title={opportunity.title}
            subtitle="Highest-value financial opportunity."
            className="h-full"
            actions={
                <StatusBadge variant={badgeVariant[opportunity.urgency]}>
                    {opportunity.urgency}
                </StatusBadge>
            }
        >
            <ExecutiveCallout
                title={formattedAmount}
                description={description}
            />

            {opportunity.invoices > 0 && (
                <button className="workspace-accent-button mt-6 w-full rounded-2xl py-3 font-medium transition hover:opacity-90">
                    Review Opportunity
                </button>
            )}
        </CommandCard>
    );
}