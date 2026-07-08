import { CommandCard } from "@/components/ui/command-card";

type Props = {
    narrative: string;
};

export function ExecutiveAiCard({
    narrative,
}: Props) {
    return (
        <CommandCard
            title="Executive AI Brief"
            subtitle="AI-generated business summary"
        >
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground/80">
                {narrative}
            </div>
        </CommandCard>
    );
}