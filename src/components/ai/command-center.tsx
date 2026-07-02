"use client";

import { useState, useTransition } from "react";
import { runAICommandAction } from "@/actions/ai-command-actions";

export function AICommandCenter() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleRunCommand() {
        if (!input.trim()) {
            return;
        }

        startTransition(async () => {
            const response = await runAICommandAction(input);
            setResult(response);
        });
    }

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">AI Command Center</h2>

            <p className="mt-1 text-sm text-foreground/60">
                Ask Vellum to summarize your workspace, show invoices, bookings, or messages.
            </p>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
                <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleRunCommand();
                        }
                    }}
                    placeholder="Try: Show unpaid invoices"
                    className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-foreground/40"
                />

                <button
                    type="button"
                    onClick={handleRunCommand}
                    disabled={isPending}
                    className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium disabled:opacity-60"
                >
                    {isPending ? "Running..." : "Run"}
                </button>
            </div>

            {result && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                    <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                        {result}
                    </pre>
                </div>
            )}
        </section>
    );
}