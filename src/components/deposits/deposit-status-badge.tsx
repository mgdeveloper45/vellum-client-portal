import { StatusBadge } from "@/components/ui/status-badge";
import { formatStatus } from "@/lib/utils";
import type { DepositStatus } from "@/lib/services/deposits/deposit-repository";


type DepositStatusBadgeProps = {
    status: DepositStatus;
};

function getVariant(status: DepositStatus) {
    switch (status) {
        case "PAID":
            return "success";

        case "PARTIALLY_PAID":
            return "warning";

        case "REFUNDED":
            return "info";

        case "CANCELLED":
            return "danger";

        case "REQUESTED":
        default:
            return "warning";
    }
}

export function DepositStatusBadge({
    status,
}: DepositStatusBadgeProps) {
    return (
        <StatusBadge
            variant={getVariant(status)}
        >
            {formatStatus(status)}
        </StatusBadge>
    );
}