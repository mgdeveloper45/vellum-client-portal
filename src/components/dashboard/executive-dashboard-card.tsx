import { CommandCard } from "@/components/ui/command-card";
import type { DashboardContext } from "@/lib/services/dashboard/dashboard-context";

type Props = {
    context: DashboardContext;
};

export function ExecutiveDashboardCard({ context }: Props) {
    return (
        <CommandCard
            title={context.executiveBrief.title}
            subtitle="Executive Operating System"
        >
            <p className="text-lg leading-8 text-foreground/70">
                {context.executiveBrief.overview}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
                <div className="rounded-2xl bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                        Overall
                    </p>
                    <p className="mt-2 text-2xl font-light">
                        {context.executiveContext.summary.overallHealth}
                    </p>
                </div>

                <div className="rounded-2xl bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                        Revenue
                    </p>
                    <p className="mt-2 text-2xl font-light">
                        {context.executiveContext.summary.revenueHealth}
                    </p>
                </div>

                <div className="rounded-2xl bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                        Clients
                    </p>
                    <p className="mt-2 text-2xl font-light">
                        {context.executiveContext.summary.clientHealth}
                    </p>
                </div>

                <div className="rounded-2xl bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                        Workspace
                    </p>
                    <p className="mt-2 text-2xl font-light">
                        {context.executiveContext.summary.workspaceHealth}
                    </p>
                </div>

                <div className="rounded-2xl bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                        Bookings
                    </p>
                    <p className="mt-2 text-2xl font-light">
                        {context.executiveContext.summary.bookingHealth}
                    </p>
                </div>
            </div>
        </CommandCard>
    );
}