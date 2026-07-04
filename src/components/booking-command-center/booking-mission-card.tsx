import type { BookingMission } from "@/lib/services/bookings/booking-mission";

type Props = {
  mission: BookingMission;
};

const priorityConfig = {
  HIGH: {
    badge: "bg-red-500 text-white",
    border: "border-red-500/30",
    title: "High Priority",
  },
  MEDIUM: {
    badge: "bg-yellow-500 text-black",
    border: "border-yellow-500/30",
    title: "Medium Priority",
  },
  LOW: {
    badge: "bg-green-500 text-white",
    border: "border-green-500/30",
    title: "Low Priority",
  },
};

export function BookingMissionCard({
  mission,
}: Props) {
  const config = priorityConfig[mission.priority];

  return (
    <section
      className={`rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg ${config.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
            Today&apos;s Mission
          </p>

          <h2 className="mt-2 text-3xl font-light">
            {mission.title}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
        >
          {config.title}
        </span>
      </div>

      <p className="mt-6 text-lg leading-8 text-foreground/75">
        {mission.description}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-foreground/50">
            Estimated Effort
          </p>

          <p className="mt-2 text-xl font-medium">
            5–10 min
          </p>
        </div>

        <div className="rounded-2xl bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-foreground/50">
            Business Impact
          </p>

          <p className="mt-2 text-xl font-medium">
            {mission.priority}
          </p>
        </div>
      </div>

      <button className="workspace-accent-button mt-8 w-full rounded-2xl py-3 font-medium transition hover:opacity-90">
        Start Mission
      </button>
    </section>
  );
}