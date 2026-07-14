import { CommandCard } from "@/components/ui/command-card";

type PulseMetric = {
    label: string;
    score: number;
};

type Props = {
    overall: number;
    revenue: number;
    bookings: number;
    workspace: number;
    capacity: number;
};

function PulseRow({
    label,
    score,
}: PulseMetric) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                    {label}
                </p>

                <p className="text-sm font-light">
                    {score}
                </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className="workspace-accent-background h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${Math.max(
                            0,
                            Math.min(score, 100),
                        )}%`,
                    }}
                />
            </div>
        </div>
    );
}

export function BusinessPulseCard({
    overall,
    revenue,
    bookings,
    workspace,
    capacity,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Health"
            title="Business Pulse"
            subtitle="A real-time view of your business health."
        >
            <div className="space-y-6">
                <PulseRow
                    label="Overall"
                    score={overall}
                />

                <PulseRow
                    label="Revenue"
                    score={revenue}
                />

                <PulseRow
                    label="Bookings"
                    score={bookings}
                />

                <PulseRow
                    label="Workspace"
                    score={workspace}
                />

                <PulseRow
                    label="Capacity"
                    score={capacity}
                />
            </div>
        </CommandCard>
    );
}