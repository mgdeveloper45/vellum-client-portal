import type { WorkspaceHealth } from "@/lib/services/workspace/workspace-health";

type Props = {
    health: WorkspaceHealth;
};

const config = {
    HEALTHY: {
        dot: "bg-green-500",
        ring: "border-green-500/30",
        message: "Your workspace is operating smoothly.",
    },
    NEEDS_ATTENTION: {
        dot: "bg-yellow-500",
        ring: "border-yellow-500/30",
        message: "A few operational items need attention.",
    },
    AT_RISK: {
        dot: "bg-red-500",
        ring: "border-red-500/30",
        message: "Immediate action is recommended.",
    },
};

export function WorkspaceHealthCard({
    health,
}: Props) {
    const state = config[health.label];

    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">
                    Workspace Health
                </h2>

                <div className={`h-3 w-3 rounded-full ${state.dot}`} />
            </div>

            <div className="mt-8 flex justify-center">
                <div
                    className={`flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 ${state.ring}`}
                >
                    <p className="text-5xl font-light">
                        {health.score}
                    </p>

                    <p className="text-sm text-foreground/60">
                        %
                    </p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-lg font-medium">
                    {health.label.replace("_", " ")}
                </p>

                <p className="mt-2 text-sm text-foreground/60">
                    {state.message}
                </p>
            </div>

            <div className="mt-8 space-y-3">
                {health.reasons.map((reason) => (
                    <div
                        key={reason}
                        className="rounded-2xl bg-background p-3 text-sm text-foreground/70"
                    >
                        {reason}
                    </div>
                ))}
            </div>
        </section>
    );
}