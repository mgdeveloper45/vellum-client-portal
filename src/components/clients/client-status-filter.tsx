import { formatClientStatus } from "@/lib/client-status";
import type { ClientStatus } from "@/lib/services/clients/client-repository";

const statuses: (ClientStatus | "ALL")[] = [
    "ALL",
    "LEAD",
    "WAITLIST",
    "CONSULTATION",
    "DEPOSIT_PENDING",
    "ACTIVE",
    "COMPLETED",
    "ARCHIVED",
    "BANNED",
];

type Props = {
    selected: ClientStatus | "ALL";
};

export function ClientStatusFilter({
    selected,
}: Props) {
    return (
        <div className="mt-8 flex flex-wrap gap-2">
            {statuses.map((status) => {
                const active = status === selected;

                return (
                    <button
                        key={status}
                        type="button"
                        className={[
                            "rounded-full border px-4 py-2 text-sm transition",
                            active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/30",
                        ].join(" ")}
                    >
                        {status === "ALL"
                            ? "All"
                            : formatClientStatus(status)}
                    </button>
                );
            })}
        </div>
    );
}