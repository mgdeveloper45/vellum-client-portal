import type { ClientStatus } from "@/lib/services/clients/client-repository";

export function formatClientStatus(status: ClientStatus): string {
    switch (status) {
        case "LEAD":
            return "Lead";

        case "WAITLIST":
            return "Waitlist";

        case "CONSULTATION":
            return "Consultation";

        case "DEPOSIT_PENDING":
            return "Deposit Pending";

        case "ACTIVE":
            return "Active";

        case "COMPLETED":
            return "Completed";

        case "ARCHIVED":
            return "Archived";

        case "BANNED":
            return "Banned";
    }
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