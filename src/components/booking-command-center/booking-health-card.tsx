import type { BookingHealthResult } from "@/lib/services/bookings/booking-health";

type BookingHealthCardProps = {
    health: BookingHealthResult;
};

const healthColors = {
    HEALTHY: "bg-green-500",
    NEEDS_ATTENTION: "bg-yellow-500",
    AT_RISK: "bg-red-500",
};

export function BookingHealthCard({
    health,
}: BookingHealthCardProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">
                    Booking Health
                </h2>

                <div
                    className={`h-3 w-3 rounded-full ${healthColors[health.label]
                        }`}
                />
            </div>

            <div className="mt-6">
                <p className="text-5xl font-light">
                    {health.score}%
                </p>

                <p className="mt-2 text-sm uppercase tracking-wide text-foreground/50">
                    {health.label.replace("_", " ")}
                </p>
            </div>

            <div className="mt-6 space-y-3">
                {health.reasons.map((reason) => (
                    <div
                        key={reason}
                        className="rounded-xl bg-background p-3 text-sm text-foreground/70"
                    >
                        {reason}
                    </div>
                ))}
            </div>
        </section>
    );
}