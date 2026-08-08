import type { Citation } from "./citation";

export function appendCitations(answer: string, citations: Citation[]): string {
  if (citations.length === 0) {
    return answer;
  }

  return `${answer}

Evidence

${citations.map(({ title, value }) => `• ${title}: ${value}`).join("\n")}`;
}
