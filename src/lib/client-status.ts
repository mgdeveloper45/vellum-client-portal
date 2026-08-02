import type { ClientStatus } from "@/lib/services/clients/client-repository";

import { CLIENT_STATUS_OPTIONS } from "./client-status-options";

export function formatClientStatus(
    status: ClientStatus,
): string {
    return (
        CLIENT_STATUS_OPTIONS.find(
            (option) => option.value === status,
        )?.label ?? status
    );
}

export function getClientStatusVariant(
    status: ClientStatus,
): "success" | "warning" | "danger" | "info" {
    switch (status) {
        case "ACTIVE":
        case "COMPLETED":
            return "success";

        case "DEPOSIT_PENDING":
            return "warning";

        case "BANNED":
            return "danger";

        case "LEAD":
        case "WAITLIST":
        case "CONSULTATION":
        case "ARCHIVED":
        default:
            return "info";
    }
}