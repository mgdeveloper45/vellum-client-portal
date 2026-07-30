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
        <ExecutivePanel
            label={label}
            value={value}
            helper={helper}
            className="p-5"
        />
    );
}