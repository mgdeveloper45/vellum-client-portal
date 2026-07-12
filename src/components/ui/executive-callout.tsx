import { ExecutivePanel } from "./executive-panel";

type Props = {
    title: string;
    description: string;
};

export function ExecutiveCallout({
    title,
    description,
}: Props) {
    return (
        <ExecutivePanel className="border-primary/20 bg-primary/[0.04] p-6">
            <h3 className="text-lg font-medium">
                {title}
            </h3>

            <p className="mt-3 leading-7 text-foreground/70">
                {description}
            </p>
        </ExecutivePanel>
    );
}