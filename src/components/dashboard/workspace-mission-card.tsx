import type { WorkspaceMission } from "@/lib/services/workspace/workspace-mission";

type Props = {
    mission: WorkspaceMission;
};

const priorityConfig = {
    HIGH: {
        badge: "bg-red-500 text-white",
    },
    MEDIUM: {
        badge: "bg-yellow-500 text-black",
    },
    LOW: {
        badge: "bg-green-500 text-white",
    },
};

export function WorkspaceMissionCard({
    mission,
}: Props) {
    const config = priorityConfig[mission.priority];

    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                        Today’s Mission
                    </p>

                    <h2 className="mt-2 text-3xl font-light">
                        {mission.title}
                    </h2>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
                >
                    {mission.priority}
                </span>
            </div>

            <p className="mt-6 text-lg text-foreground/75">
                {mission.description}
            </p>
        </section>
    );
}