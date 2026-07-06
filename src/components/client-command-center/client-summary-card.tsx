import { CommandCard } from "@/components/ui/command-card";

type Props = {
    summary: string;
};

export function ClientSummaryCard({
    summary,
}: Props) {
    return (
        <CommandCard
            title="AI Client Summary"
            subtitle="Executive overview"
        >
            <p className="text-lg leading-8 text-foreground/70">
                {summary}
            </p>
        </CommandCard>
    );
}