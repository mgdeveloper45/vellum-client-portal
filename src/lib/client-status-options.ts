import type { ClientStatus } from "@/lib/services/clients/client-repository";

export const CLIENT_STATUS_OPTIONS: ReadonlyArray<{
    value: ClientStatus;
    label: string;
}> = [
    {
        value: "LEAD",
        label: "Lead",
    },
    {
        value: "WAITLIST",
        label: "Waitlist",
    },
    {
        value: "CONSULTATION",
        label: "Consultation",
    },
    {
        value: "DEPOSIT_PENDING",
        label: "Deposit Pending",
    },
    {
        value: "ACTIVE",
        label: "Active",
    },
    {
        value: "COMPLETED",
        label: "Completed",
    },
    {
        value: "ARCHIVED",
        label: "Archived",
    },
    {
        value: "BANNED",
        label: "Banned",
    },
] as const;