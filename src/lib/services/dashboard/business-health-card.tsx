import type {
  BusinessHealthScore,
} from "@/lib/services/intelligence/business-health-score";

type Props = {
  score: BusinessHealthScore;
};

export function BusinessHealthCard({
  score,
}: Props) {
  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">
        Business Health
      </h2>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p
            className={`text-5xl font-bold ${colorClasses[score.color]}`}
          >
            {score.grade}
          </p>

          <p className="mt-2 text-sm text-foreground/60">
            Overall Grade
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-semibold">
            {score.score}
          </p>

          <p className="text-sm text-foreground/60">
            out of 100
          </p>
        </div>
      </div>
    </section>
  );
}