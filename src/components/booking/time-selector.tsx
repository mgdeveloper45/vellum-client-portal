import { createBookingAction } from "@/actions/booking-actions";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";

type TimeSelectorProps = {
    slug: string;
    workspaceId: string;
    serviceId: string;
    selectedDate: string;
    selectedTime?: string;
    availableSlots: string[];
};

export function TimeSelector({
    slug,
    workspaceId,
    serviceId,
    selectedDate,
    selectedTime,
    availableSlots,
}: TimeSelectorProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <p className="workspace-accent-text text-sm font-medium">
                Step 3
            </p>

            <h2 className="mt-2 text-2xl font-light">
                Choose a time
            </h2>

            {availableSlots.length === 0 ? (
                <ExecutiveEmptyState
                    title="No times available"
                    description="There are no open appointments for this date. Choose another date to see additional availability."
                    className="mt-6 min-h-[220px]"
                />
            ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot;

                        return (
                            <a
                                key={slot}
                                href={`/book/${slug}?serviceId=${serviceId}&date=${selectedDate}&time=${slot}`}
                                className={
                                    isSelected
                                        ? "workspace-accent-button rounded-full px-5 py-3 text-center text-sm font-medium"
                                        : "rounded-full border border-border px-5 py-3 text-center text-sm font-medium transition hover:border-foreground/40"
                                }
                            >
                                {slot}
                            </a>
                        );
                    })}
                </div>
            )}

            {selectedTime && (
                <form
                    action={createBookingAction}
                    className="mt-8 rounded-2xl border border-border bg-background p-5 sm:p-6"
                >
                    <input
                        type="hidden"
                        name="workspaceId"
                        value={workspaceId}
                    />

                    <input
                        type="hidden"
                        name="serviceId"
                        value={serviceId}
                    />

                    <input
                        type="hidden"
                        name="date"
                        value={selectedDate}
                    />

                    <input
                        type="hidden"
                        name="startTime"
                        value={selectedTime}
                    />

                    <h3 className="text-xl font-medium">
                        Your information
                    </h3>

                    <p className="mt-2 text-sm text-foreground/70">
                        You selected {selectedTime}. Enter your details to confirm.
                    </p>

                    <div className="mt-5 grid gap-3">
                        <input
                            name="customerName"
                            required
                            placeholder="Your name"
                            className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
                        />

                        <input
                            name="customerEmail"
                            required
                            type="email"
                            placeholder="Email address"
                            className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
                        />

                        <input
                            name="customerPhone"
                            placeholder="Phone optional"
                            className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
                        />

                        <textarea
                            name="notes"
                            placeholder="Notes optional"
                            className="min-h-24 rounded-lg border border-border bg-card px-4 py-3 text-sm"
                        />
                    </div>

                    <button className="workspace-accent-button mt-5 w-full rounded-full px-5 py-3 text-sm font-medium">
                        Confirm Booking
                    </button>
                </form>
            )}
        </section>
    );
}