import { createBookingAction } from "@/actions/booking-actions";
import { joinWaitlistAction } from "@/actions/waitlist-actions";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";

type TimeSelectorProps = {
  slug: string;
  workspaceId: string;
  serviceId: string;
  selectedDate: string;
  selectedTime?: string;
  availableSlots: string[];
  waitlistAllowed: boolean;
  waitlistStatus?: string;
  waitlistError?: string;
};

export function TimeSelector({
  slug,
  workspaceId,
  serviceId,
  selectedDate,
  selectedTime,
  availableSlots,
  waitlistAllowed,
  waitlistStatus,
  waitlistError,
}: TimeSelectorProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <p className="workspace-accent-text text-sm font-medium">
        Step 3
      </p>

      <h2 className="mt-2 text-2xl font-light">
        Choose a time
      </h2>

      {waitlistStatus === "joined" && (
        <div className="mt-6 rounded-2xl border border-border bg-background p-5">
          <p className="font-medium">
            You&apos;re on the waitlist.
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            We&apos;ll use the contact information you
            provided if an opening becomes available.
          </p>
        </div>
      )}

      {waitlistStatus === "error" && (
        <div className="mt-6 rounded-2xl border border-border bg-background p-5">
          <p className="font-medium">
            We couldn&apos;t add you to the waitlist.
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            {waitlistError === "ALREADY_WAITLISTED"
              ? "You are already on the waitlist for this service and date."
              : "Check your information and try again."}
          </p>
        </div>
      )}

      {availableSlots.length === 0 ? (
        <div className="mt-6 space-y-6">
          <ExecutiveEmptyState
            title="No times available"
            description={
              waitlistAllowed
                ? "There are no open appointments for this date. Join the waitlist or choose another date."
                : "There are no open appointments for this date. Choose another date to see additional availability."
            }
            className="min-h-[220px]"
          />

          {waitlistAllowed &&
            waitlistStatus !== "joined" && (
              <form
                action={joinWaitlistAction}
                className="rounded-2xl border border-border bg-background p-5 sm:p-6"
              >
                <input
                  type="hidden"
                  name="slug"
                  value={slug}
                />
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
                  name="requestedDate"
                  value={selectedDate}
                />

                <h3 className="text-xl font-medium">
                  Join the waitlist
                </h3>

                <p className="mt-2 text-sm text-foreground/70">
                  Tell us how to reach you if an
                  appointment opens on this date.
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

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm">
                      Preferred start
                      <input
                        name="preferredStartTime"
                        type="time"
                        className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
                      />
                    </label>

                    <label className="grid gap-2 text-sm">
                      Preferred end
                      <input
                        name="preferredEndTime"
                        type="time"
                        className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
                      />
                    </label>
                  </div>

                  <textarea
                    name="notes"
                    placeholder="Notes optional"
                    className="min-h-24 rounded-lg border border-border bg-card px-4 py-3 text-sm"
                  />
                </div>

                <button className="workspace-accent-button mt-5 w-full rounded-full px-5 py-3 text-sm font-medium">
                  Join Waitlist
                </button>
              </form>
            )}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {availableSlots.map((slot) => {
            const isSelected =
              selectedTime === slot;

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
            You selected {selectedTime}. Enter your
            details to confirm.
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
