import { RecommendationCard } from "@/components/ui/recommendation-card";
import { CommandCard } from "@/components/ui/command-card";
import type { ClientOpportunityResult } from "@/lib/services/clients/client-opportunities";

type Props = {
    opportunities: ClientOpportunityResult[];
};

export function ClientOpportunitiesCard({
    opportunities,
}: Props) {
    return (
        <CommandCard
            title="Recommended Actions"
            subtitle="Client opportunities"
        >
            <div className="space-y-4">
                {opportunities.map((opportunity) => (
                    <RecommendationCard
                        key={opportunity.type}
                        title={opportunity.title}
                        description={opportunity.description}
                        href="/clients"
                        priority={opportunity.priority}
                    />
                ))}
            </div>
        </CommandCard>
    );
}