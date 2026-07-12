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
            eyebrow="Business Health"
            title={`${health.score}%`}
            subtitle={state.message}
            className="h-full"
            actions={
                <StatusBadge
                    variant={
                        health.label === "HEALTHY"
                            ? "success"
                            : health.label === "NEEDS_ATTENTION"
                                ? "warning"
                                : "danger"
                    }
                >
                    {health.label.replace("_", " ")}
                </StatusBadge>
            }
        >
            <div className="space-y-3">
                {health.reasons.map((reason) => (
                    <div
                        key={reason}
                        className="rounded-2xl border border-border bg-background p-4"
                    >
                        {reason}
                    </div>
                ))}
            </div>
        </CommandCard>
    );
}