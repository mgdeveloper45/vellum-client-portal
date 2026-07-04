import type { WorkspaceExecutiveBrief } from "@/lib/services/workspace/workspace-executive-brief";

type Props = {
    brief: WorkspaceExecutiveBrief;
};

export function WorkspaceExecutiveBriefCard({ brief }: Props) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                        Executive Brief
                    </p>

                    <h2 className="mt-2 text-3xl font-light">{brief.headline}</h2>
                </div>

                <span className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground/60">
                    {brief.confidence}% confidence
                </span>
            </div>

            <p className="mt-6 text-lg leading-8 text-foreground/75">
                {brief.summary}
            </p>
        </section>
    );
}