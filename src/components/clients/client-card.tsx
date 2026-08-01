import Link from "next/link";

import { ClientStatusBadge } from "./client-status-badge";
import { ExecutiveCard } from "@/components/ui/executive-card";

import type { ClientSummaryRecord } from "@/lib/services/clients/client-repository";

type ClientCardProps = {
    client: ClientSummaryRecord;
};

export function ClientCard({
    client,
}: ClientCardProps) {
    return (
        <Link
            href={`/clients/${client.id}`}
            className="block"
        >
            <ExecutiveCard className="h-full transition hover:border-primary/30 hover:shadow-md">
                <ExecutiveCard.Body>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-medium">
                                {client.firstName}{" "}
                                {client.lastName}
                            </h2>

                            <p className="mt-2 text-sm text-foreground/60">
                                {client.email}
                            </p>
                        </div>

                        <ClientStatusBadge
                            status={client.clientStatus}
                        />
                    </div>

                    <p className="mt-6 text-sm text-accent">
                        {client.projectCount} Project
                        {client.projectCount !== 1
                            ? "s"
                            : ""}
                    </p>
                </ExecutiveCard.Body>
            </ExecutiveCard>
        </Link>
    );
}