import type { WorkspaceExecutiveBrief } from "@/lib/services/workspace/workspace-executive-brief";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    brief: WorkspaceExecutiveBrief;
};

export function WorkspaceExecutiveBriefCard({
    brief,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Intelligence"
            title={brief.headline}
            subtitle="AI-generated operational summary."
            actions={
                <StatusBadge variant="success">
                    {brief.confidence}% Confidence
                </StatusBadge>
            }
            className="h-full"
        >
            <p className="text-lg font-light leading-8 text-foreground/75">
                {brief.summary}
            </p>
        </CommandCard>
    );
}