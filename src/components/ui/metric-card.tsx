import type { ReactNode } from "react";
import { CommandCard } from "./command-card";

type Props = {
    label: string;
    value: string | number;
    helper?: string;
    icon?: ReactNode;
};

export function MetricCard({ label, value, helper, icon }: Props) {
    return (
        <CommandCard>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-foreground/60">{label}</p>

                    <p className="mt-3 text-3xl font-light">{value}</p>

                    {helper && (
                        <p className="mt-2 text-sm text-foreground/50">{helper}</p>
                    )}
                </div>

                {icon && (
                    <div className="rounded-2xl bg-background p-3">
                        {icon}
                    </div>
                )}
            </div>
        </CommandCard>
    );
}