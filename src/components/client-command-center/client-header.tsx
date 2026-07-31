import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    name: string;
    email: string;
    health: "EXCELLENT" | "GOOD" | "ATTENTION" | "AT_RISK";
};

const variant = {
    EXCELLENT: "success",
    GOOD: "info",
    ATTENTION: "warning",
    AT_RISK: "danger",
} as const;

export function ClientHeader({
    name,
    email,
    health,
}: Props) {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <h1 className="text-4xl font-light">
                    {name}
                </h1>

                <p className="mt-2 text-foreground/60">
                    {email}
                </p>
            </div>

            <StatusBadge variant={variant[health]}>
                {health.replace("_", " ")}
            </StatusBadge>
        </div>
    );
}