import { openai } from "@/lib/openai";

export async function askAI(prompt: string) {
  if (process.env.AI_MOCK_MODE === "true") {
    return `
Good news — Vellum AI is running in development mock mode.

Today's summary:
- Review today's bookings.
- Follow up on unpaid invoices.
- Check recent client messages.
- Prioritize active projects with pending milestones.

Highest priority:
Make sure all unpaid invoices and upcoming bookings are handled before the end of the day.
`;
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error("AI request failed:", error);

    return "AI summary is unavailable right now. Please check your OpenAI API billing/quota and try again.";
  }
}
