import type {
  ExecutiveIntelligence,
} from "@/lib/services/dashboard/executive-intelligence-builder";

type Props = {
  intelligence: ExecutiveIntelligence;
};

export function ExecutiveIntelligenceCard({
  intelligence,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-2xl font-semibold">
        Executive Intelligence
      </h2>

      <p className="mt-2 text-lg font-medium">
        Health: {intelligence.health}
      </p>

      <Section
        title="Strengths"
        items={intelligence.strengths}
      />

      <Section
        title="Risks"
        items={intelligence.risks}
      />

      <Section
        title="Recommendations"
        items={intelligence.recommendations}
      />
    </section>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="mt-6">
      <h3 className="font-medium">
        {title}
      </h3>

      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/70">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}