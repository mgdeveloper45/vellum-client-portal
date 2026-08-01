import { StatusBadge } from "@/components/ui/status-badge";
import {
    formatClientStatus,
    getClientStatusVariant,
} from "@/lib/client-status";

import type { ClientStatus } from "@/lib/services/clients/client-repository";

type Props = {
    status: ClientStatus;
};

export function ClientStatusBadge({
    status,
}: Props) {
    return (
        <StatusBadge
            variant={getClientStatusVariant(status)}
        >
            {formatClientStatus(status)}
        </StatusBadge>
    );
}