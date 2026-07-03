import type { BookingMission } from "@/lib/services/bookings/booking-mission";

type BookingMissionCardProps = {
  mission: BookingMission;
};

const priorityClasses = {
  HIGH: "border-red-500 bg-red-500/10",
  MEDIUM: "border-yellow-500 bg-yellow-500/10",
  LOW: "border-green-500 bg-green-500/10",
};

export function BookingMissionCard({
  mission,
}: BookingMissionCardProps) {
  return (
    <section
      className={`rounded-3xl border p-6 ${priorityClasses[mission.priority]}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">
        Today’s Mission
      </p>

      <h2 className="mt-3 text-2xl font-light">
        {mission.title}
      </h2>

      <p className="mt-3 text-foreground/70">
        {mission.description}
      </p>
    </section>
  );
}