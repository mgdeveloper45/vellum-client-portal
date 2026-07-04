import type { WorkspaceRisk } from "@/lib/services/workspace/workspace-risk";

type Props = {
    risks: WorkspaceRisk[];
};

const severityConfig = {
    HIGH: {
        color: "bg-red-500",
        label: "High",
    },
    MEDIUM: {
        color: "bg-yellow-500",
        label: "Medium",
    },
    LOW: {
        color: "bg-green-500",
        label: "Low",
    },
};

export function WorkspaceRiskCard({
    risks,
}: Props) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light">
                    Workspace Risks
                </h2>

                <span className="text-sm text-foreground/50">
                    {risks.length} Active
                </span>
            </div>

            <div className="mt-6 space-y-4">
                {risks.map((risk) => {
                    const config = severityConfig[risk.severity];

                    return (
                        <div
                            key={risk.title}
                            className="rounded-2xl border border-border bg-background p-4"
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-medium">
                                    {risk.title}
                                </p>

                                <div className="flex items-center gap-2">
                                    <div
                                        className={`h-2.5 w-2.5 rounded-full ${config.color}`}
                                    />

                                    <span className="text-xs text-foreground/60">
                                        {config.label}
                                    </span>
                                </div>
                            </div>

                            <p className="mt-2 text-sm text-foreground/70">
                                {risk.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}