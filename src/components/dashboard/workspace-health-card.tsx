import type { WorkspaceHealth } from "@/lib/services/workspace/workspace-health";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    health: WorkspaceHealth;
};

const config = {
    HEALTHY: {
        ring: "border-green-500/35",
        glow: "shadow-[0_0_40px_rgba(34,197,94,0.10)]",
        badge: "success",
        message: "Your workspace is operating smoothly.",
    },
    NEEDS_ATTENTION: {
        ring: "border-yellow-500/35",
        glow: "shadow-[0_0_40px_rgba(234,179,8,0.10)]",
        badge: "warning",
        message: "A few operational items need attention.",
    },
    AT_RISK: {
        ring: "border-red-500/35",
        glow: "shadow-[0_0_40px_rgba(239,68,68,0.10)]",
        badge: "danger",
        message: "Immediate action is recommended.",
    },
} as const;

export function WorkspaceHealthCard({ health }: Props) {
    const state = config[health.label];

    return (
        <CommandCard
            eyebrow="Workspace Intelligence"
            title="Workspace Health"
            subtitle="A live assessment of operational readiness."
            actions={
                <StatusBadge variant={state.badge}>
                    {health.label.replaceAll("_", " ")}
                </StatusBadge>
            }
            className="h-full"
        >
            <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
                <div
                    className={`mx-auto flex h-40 w-40 shrink-0 flex-col items-center justify-center rounded-full border-8 bg-background/60 ${state.ring} ${state.glow}`}
                >
                    <p className="text-5xl font-light tracking-tight">
                        {health.score}
                    </p>

                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground/45">
                        Health
                    </p>
                </div>

                <div>
                    <p className="text-lg font-light leading-8 text-foreground/75">
                        {state.message}
                    </p>

                    <div className="mt-5 space-y-3">
                        {health.reasons.map((reason) => (
                            <div
                                key={reason}
                                className="rounded-2xl border border-border/50 bg-background/60 px-4 py-3 text-sm leading-6 text-foreground/65"
                            >
                                {reason}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CommandCard>
    );
}