import type { WorkspaceExecutiveBrief } from "@/lib/services/workspace/workspace-executive-brief";
import { CommandCard } from "@/components/ui/command-card";

type Props = {
    brief: WorkspaceExecutiveBrief;
};

export function WorkspaceExecutiveBriefCard({
    brief,
}: Props) {
    return (
        <CommandCard
            title={brief.headline}
            subtitle="Executive Brief"
            actions={
                <div className="rounded-full border border-border bg-background px-4 py-2 text-sm">
                    {brief.confidence}% confidence
                </div>
            }
        >
            <p className="text-lg leading-8 text-foreground/75">
                {brief.summary}
            </p>
        </CommandCard>
    );
}