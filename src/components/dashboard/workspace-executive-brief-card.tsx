import type { WorkspaceExecutiveBrief } from "@/lib/services/workspace/workspace-executive-brief";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveCallout } from "@/components/ui/executive-callout";

type Props = {
    brief: WorkspaceExecutiveBrief;
};

export function WorkspaceExecutiveBriefCard({
    brief,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Advisor"
            title={brief.headline}
            subtitle="Today's business intelligence."
            className="h-full"
            actions={
                <div className="rounded-full border border-border bg-background px-4 py-2 text-sm">
                    {brief.confidence}% confidence
                </div>
            }
        >
            <ExecutiveCallout
                title="Advisor Summary"
                description={brief.summary}
            />
        </CommandCard>
    );
}