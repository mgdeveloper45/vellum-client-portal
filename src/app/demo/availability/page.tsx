import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoServices } from "@/lib/demo/demo-data";

const availability = [
  {
    day: "Monday",
    enabled: true,
    hours: "9:00 AM – 5:00 PM",
  },
  {
    day: "Tuesday",
    enabled: true,
    hours: "9:00 AM – 5:00 PM",
  },
  {
    day: "Wednesday",
    enabled: true,
    hours: "9:00 AM – 5:00 PM",
  },
  {
    day: "Thursday",
    enabled: true,
    hours: "9:00 AM – 5:00 PM",
  },
  {
    day: "Friday",
    enabled: true,
    hours: "9:00 AM – 3:00 PM",
  },
  {
    day: "Saturday",
    enabled: false,
    hours: "Unavailable",
  },
  {
    day: "Sunday",
    enabled: false,
    hours: "Unavailable",
  },
];

export default function DemoAvailabilityPage() {
  const availableDays = availability.filter(
    (day) => day.enabled,
  ).length;

  return (
    <DemoShell>
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Scheduling
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            Availability
          </h1>

          <p className="mt-3 max-w-3xl text-foreground/60">
            Control when clients can schedule services and keep your
            booking calendar aligned with your working hours.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Available Days
            </p>

            <p className="mt-4 text-3xl font-light">
              {availableDays}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Days accepting bookings
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Active Services
            </p>

            <p className="mt-4 text-3xl font-light">
              {demoServices.filter((service) => service.active).length}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Connected to scheduling
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Time Zone
            </p>

            <p className="mt-4 text-3xl font-light">
              Pacific
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              America/Los_Angeles
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-xl font-medium">
                Weekly Availability
              </h2>

              <p className="mt-1 text-sm text-foreground/50">
                Standard hours clients can use when scheduling.
              </p>
            </div>

            <div className="divide-y divide-border">
              {availability.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between gap-6 px-6 py-5"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        day.enabled
                          ? "bg-emerald-500"
                          : "bg-foreground/20"
                      }`}
                    />

                    <div>
                      <p className="font-medium">
                        {day.day}
                      </p>

                      <p className="mt-1 text-sm text-foreground/50">
                        {day.enabled
                          ? "Accepting bookings"
                          : "No availability"}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-sm ${
                      day.enabled
                        ? "font-medium"
                        : "text-foreground/40"
                    }`}
                  >
                    {day.hours}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Booking Rules
              </p>

              <h2 className="mt-3 text-2xl font-light">
                Scheduling preferences
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-foreground/50">
                    Minimum Notice
                  </p>

                  <p className="mt-1 font-medium">
                    24 hours
                  </p>
                </div>

                <div>
                  <p className="text-sm text-foreground/50">
                    Booking Window
                  </p>

                  <p className="mt-1 font-medium">
                    60 days
                  </p>
                </div>

                <div>
                  <p className="text-sm text-foreground/50">
                    Buffer Between Meetings
                  </p>

                  <p className="mt-1 font-medium">
                    15 minutes
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
              <p className="font-medium">
                Your calendar, your rules
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground/60">
                In a live Vellum workspace, availability rules determine
                when clients can schedule each of your active services.
              </p>

              <Link
                href="/demo/services"
                className="mt-4 inline-block text-sm font-medium workspace-accent-text"
              >
                Explore services →
              </Link>
            </section>
          </aside>
        </div>

        <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">
              See scheduling in action
            </p>

            <p className="mt-2 text-sm text-foreground/60">
              Explore the bookings created from this demo availability.
            </p>
          </div>

          <Link
            href="/demo/bookings"
            className="workspace-accent-button shrink-0 rounded-2xl px-5 py-3 text-center text-sm font-medium"
          >
            View Bookings
          </Link>
        </section>
      </div>
    </DemoShell>
  );
}
