import { ExecutivePanel } from "./executive-panel";

type Props = {
    label: string;
    value: string;
    helper?: string;
};

export function ExecutiveMetricTile({
    label,
    value,
    helper,
}: Props) {
    return (
        <ExecutivePanel className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                {label}
            </p>

            <p className="mt-3 text-3xl font-light">
                {value}
            </p>

            {helper && (
                <p className="mt-2 text-sm text-foreground/55">
                    {helper}
                </p>
            )}
        </ExecutivePanel>
    );
}