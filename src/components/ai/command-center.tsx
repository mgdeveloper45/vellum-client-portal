"use client";

import { useState, useTransition } from "react";
import {
    confirmAICommandAction,
    runAICommandAction,
    type AICommandResult,
} from "@/actions/ai-command-actions";

export function AICommandCenter() {
    const [input, setInput] = useState("");
    const [result, setResult] =
        useState<AICommandResult | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleRunCommand() {
        const command = input.trim();

        if (!command) {
            return;
        }

        startTransition(async () => {
            const response = await runAICommandAction(command);

            setResult(response);
            setInput("");
        });
    }

    function handleConfirmCommand() {
        if (result?.type !== "CONFIRMATION") {
            return;
        }

        const command = result.command;

        startTransition(async () => {
            const response =
                await confirmAICommandAction(command);

            setResult({
                type: "ANSWER",
                message: response.message,
                document:
                    response.success
                        ? response.document
                        : undefined,
                metadata:
                    response.success
                        ? response.metadata
                        : undefined,
            });
        });
    }

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">
                AI Command Center
            </h2>

            <p className="mt-1 text-sm text-foreground/60">
                Ask Vellum to summarize your workspace,
                show invoices, bookings, or messages.
            </p>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
                <input
                    value={input}
                    onChange={(event) =>
                        setInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleRunCommand();
                        }
                    }}
                    disabled={isPending}
                    aria-label="AI command"
                    aria-describedby="ai-command-help"
                    placeholder="Try: Show unpaid invoices"
                    className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p
                    id="ai-command-help"
                    className="sr-only"
                >
                    Enter a natural language command
                    describing what you want Vellum AI
                    to do.
                </p>

                <button
                    type="button"
                    onClick={handleRunCommand}
                    disabled={isPending || !input.trim()}
                    className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? "Running..." : "Run"}
                </button>
            </div>

            {result?.type === "ANSWER" && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                    <pre className="whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                        {result.message}
                    </pre>
                </div>
            )}

            {result?.type === "ANSWER" &&
                result.document && (
                    <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                            Generated Draft
                        </p>

                        <h3 className="mt-2 text-lg font-medium">
                            {result.document.title}
                        </h3>

                        <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/80">
                            {result.document.content}
                        </div>
                    </div>
                )}

            {result?.type === "CONFIRMATION" && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium">
                        Confirmation required
                    </p>

                    <p className="mt-2 text-sm leading-6 text-foreground/70">
                        {result.message}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setResult(null)}
                            disabled={isPending}
                            className="rounded-full border border-border px-5 py-2 text-sm font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmCommand}
                            disabled={isPending}
                            className="workspace-accent-button rounded-full px-5 py-2 text-sm font-medium"
                        >
                            {isPending ? "Confirming..." : "Confirm"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}