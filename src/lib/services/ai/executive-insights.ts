import type { ExecutiveContext } from "./executive-engine";

export function buildExecutiveNarrative(context: ExecutiveContext): string {
  const recommendations = context.recommendations
    .map((recommendation) => `• ${recommendation.title}`)
    .join("\n");

  return `
Executive Daily Brief

Overall Health: ${context.summary.overallHealth}/100

Top Recommendations

${recommendations}
`.trim();
}
