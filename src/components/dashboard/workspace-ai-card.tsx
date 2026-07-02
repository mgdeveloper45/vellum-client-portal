"use client";

import { useState, useTransition } from "react";
import { getWorkspaceSummaryAction } from "@/actions/ai-actions";

export function WorkspaceAICard() {
    const [summary, setSummary] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleGenerateSummary() {
        startTransition(async () => {
            const result = await getWorkspaceSummaryAction();
            setSummary(result);
        });
    }

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-light">Workspace AI</h2>

                    <p className="mt-1 text-sm text-foreground/60">
                        Generate a smart summary of bookings, invoices, projects, and messages.
                    </p>
                </div>

                <span className="rounded-full border border-border bg-background px-3 py-1 text-sm">
                    AI
                </span>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                {summary ? (
                    <div className="whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                        {summary}
                    </div>
                ) : (
                    <p className="text-sm text-foreground/60">
                        Click below to generate today&apos;s business summary.
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isPending}
                className="workspace-accent-button mt-5 rounded-full px-5 py-3 text-sm font-medium disabled:opacity-60"
            >
                {isPending ? "Generating..." : "Generate Summary"}
            </button>
        </section>
    );
}