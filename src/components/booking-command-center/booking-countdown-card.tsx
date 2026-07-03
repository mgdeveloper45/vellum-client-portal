import type { BookingCountdown } from "@/lib/services/bookings/booking-countdown";

type Props = {
  countdown: BookingCountdown;
};

export function BookingCountdownCard({
  countdown,
}: Props) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
        Countdown
      </p>

      <h2
        className={`mt-4 text-4xl font-light ${
          countdown.urgent
            ? "text-orange-500"
            : ""
        }`}
      >
        {countdown.label}
      </h2>

      <p className="mt-3 text-sm text-foreground/60">
        Time remaining until the appointment.
      </p>
    </section>
  );
}