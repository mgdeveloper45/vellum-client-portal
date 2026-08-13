import Link from "next/link";

import { createProjectFromBookingAction } from "@/actions/booking-actions";
import type { BookingRecommendedAction } from "@/lib/services/bookings/booking-actions";

type Props = {
    actions: BookingRecommendedAction[];
};

function ActionContent({
    action,
}: {
    action: BookingRecommendedAction;
}) {
    return (
        <>
            <div className="flex items-center justify-between">
                <p className="font-medium">{action.title}</p>

                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    {action.priority}
                </span>
            </div>

            <p className="mt-2 text-sm text-foreground/60">
                {action.description}
            </p>
        </>
    );
}

export function BookingActionsCard({ actions }: Props) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl font-medium">Recommended Actions</h2>

            <div className="mt-5 grid gap-3">
                {actions.map((action) => {
                    if (action.type === "COMMAND") {
                        switch (action.command) {
                            case "CREATE_PROJECT":
                                return (
                                    <form
                                        key={action.id}
                                        action={createProjectFromBookingAction}
                                    >
                                        <input
                                            type="hidden"
                                            name="bookingId"
                                            value={action.bookingId}
                                        />

                                        <button
                                            type="submit"
                                            className="w-full rounded-2xl border border-border bg-background p-4 text-left transition hover:border-accent"
                                        >
                                            <ActionContent action={action} />
                                        </button>
                                    </form>
                                );
                        }
                    }

                    if (action.type === "NAVIGATION") {
                        return (
                            <Link
                                key={action.id}
                                href={action.href}
                                className="rounded-2xl border border-border bg-background p-4 transition hover:border-accent"
                            >
                                <ActionContent action={action} />
                            </Link>
                        );
                    }

                    return null;
                })}
            </div>
        </section>
    );
}