import { MetricsGrid } from "./metrics-grid";
import { ProfessionalMetrics } from "./professional-metrics";
import { BookingsTrendChart } from "./bookings-trend-chart";
import { RevenueSummaryChart } from "./revenue-summary-chart";

type Metric = {
    label: string;
    value: string | number;
    helper: string;
};

type BookingTrend = {
    label: string;
    count: number;
};

type Props = {
    heroMetrics: Metric[];
    professionalMetrics: Metric[];
    bookingTrendData: BookingTrend[];
    revenueCollected: number;
    revenueOutstanding: number;
    isProfessional: boolean;
};

export function DashboardAnalyticsSection({
    heroMetrics,
    professionalMetrics,
    bookingTrendData,
    revenueCollected,
    revenueOutstanding,
    isProfessional,
}: Props) {
    return (
        <>
            <MetricsGrid metrics={heroMetrics} />

            {isProfessional && (
                <ProfessionalMetrics metrics={professionalMetrics} />
            )}

            <section className="mt-8 grid gap-6 xl:grid-cols-2">
                <BookingsTrendChart data={bookingTrendData} />

                <RevenueSummaryChart
                    collected={revenueCollected}
                    outstanding={revenueOutstanding}
                />
            </section>
        </>
    );
}