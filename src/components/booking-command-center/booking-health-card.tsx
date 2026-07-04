import type { BookingHealthResult } from "@/lib/services/bookings/booking-health";

type Props = {
    health: BookingHealthResult;
};

const healthConfig = {
    HEALTHY: {
        color: "bg-green-500",
        ring: "border-green-500/40",
        text: "Everything looks great.",
    },
    NEEDS_ATTENTION: {
        color: "bg-yellow-500",
        ring: "border-yellow-500/40",
        text: "A few items need attention.",
    },
    AT_RISK: {
        color: "bg-red-500",
        ring: "border-red-500/40",
        text: "Immediate action recommended.",
    },
};

export function BookingHealthCard({
    health,
}: Props) {
    const config = healthConfig[health.label];

    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">
                    Booking Health
                </h2>

                <div className={`h-3 w-3 rounded-full ${config.color}`} />
            </div>

            <div className="mt-8 flex justify-center">
                <div
                    className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-8 ${config.ring}`}
                >
                    <p className="text-5xl font-light">
                        {health.score}
                    </p>

                    <p className="mt-1 text-sm text-foreground/60">
                        %
                    </p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-lg font-medium">
                    {health.label.replace("_", " ")}
                </p>

                <p className="mt-2 text-sm text-foreground/60">
                    {config.text}
                </p>
            </div>

            <div className="mt-8 space-y-3">
                {health.reasons.map((reason) => (
                    <div
                        key={reason}
                        className="rounded-2xl bg-background p-4 text-sm text-foreground/70"
                    >
                        {reason}
                    </div>
                ))}
            </div>
        </section>
    );
}