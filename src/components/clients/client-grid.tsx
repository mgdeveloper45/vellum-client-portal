import { ClientCard } from "./client-card";

import type { ClientSummaryRecord } from "@/lib/services/clients/client-repository";

type ClientGridProps = {
    clients: ClientSummaryRecord[];
};

export function ClientGrid({
    clients,
}: ClientGridProps) {
    return (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
                <ClientCard
                    key={client.id}
                    client={client}
                />
            ))}
        </div>
    );
}