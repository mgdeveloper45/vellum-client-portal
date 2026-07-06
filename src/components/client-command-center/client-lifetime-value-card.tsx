import { MetricCard } from "@/components/ui/metric-card";

type Props = {
    lifetimeValue: number;
    averageBookingValue: number;
};

export function ClientLifetimeValueCard({
    lifetimeValue,
    averageBookingValue,
}: Props) {
    return (
        <MetricCard
            label="Lifetime Value"
            value={`$${lifetimeValue.toLocaleString()}`}
            helper={`Average Booking $${averageBookingValue.toLocaleString()}`}
        />
    );
}