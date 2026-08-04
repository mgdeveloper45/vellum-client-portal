import { AICommandCenter } from "@/components/ai/command-center";
import { WorkspaceActionsCard } from "@/components/dashboard/workspace-actions-card";
import { WorkspaceAICard } from "@/components/dashboard/workspace-ai-card";
import { ExecutiveSection } from "@/components/ui/executive-section";

type Props = {
    userId: string;
    workspaceId: string;
};

export function AIDashboardSection({
    userId,
    workspaceId,
}: Props) {
    return (
        <>
            <ExecutiveSection
                eyebrow="Executive Advisor"
                title="Command Center"
                description="Run guided business commands and explore workspace intelligence."
            >
                <AICommandCenter />
            </ExecutiveSection>

            <div className="mt-10 grid gap-6 xl:grid-cols-2">
                <WorkspaceActionsCard
                    userId={userId}
                    workspaceId={workspaceId}
                />

                <WorkspaceAICard />
            </div>
        </>
    );
}