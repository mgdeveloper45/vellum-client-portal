"use client";

import { useState } from "react";

import { runProjectCopilotAction } from "@/actions/project-copilot-actions";
import {
    generateProjectStatusAction,
    generateProjectSummaryAction,
} from "@/actions/project-ai-actions";

type ProjectAiIntelligenceProps = {
    projectId: string;
};

type ActiveGeneration =
    | "SUMMARY"
    | "STATUS"
    | "COPILOT"
    | null;

type ResultType =
    | "SUMMARY"
    | "STATUS"
    | "COPILOT"
    | null;

export function ProjectAiIntelligence({
    projectId,
}: ProjectAiIntelligenceProps) {
    const [content, setContent] = useState("");
    const [resultType, setResultType] =
        useState<ResultType>(null);

    const [activeGeneration, setActiveGeneration] =
        useState<ActiveGeneration>(null);

    const [error, setError] = useState<string | null>(
        null,
    );

    const [copilotInput, setCopilotInput] =
        useState("");

    async function handleGenerateSummary() {
        setError(null);
        setActiveGeneration("SUMMARY");

        try {
            const result =
                await generateProjectSummaryAction(projectId);

            if (!result.success) {
                setError(result.error);
                return;
            }

            setContent(result.content);
            setResultType("SUMMARY");
        } catch {
            setError(
                "Unable to generate project summary.",
            );
        } finally {
            setActiveGeneration(null);
        }
    }

    async function handleGenerateStatus() {
        setError(null);
        setActiveGeneration("STATUS");

        try {
            const result =
                await generateProjectStatusAction(projectId);

            if (!result.success) {
                setError(result.error);
                return;
            }

            setContent(result.content);
            setResultType("STATUS");
        } catch {
            setError(
                "Unable to generate project status.",
            );
        } finally {
            setActiveGeneration(null);
        }
    }

    async function handleCopilotCommand() {
        const query = copilotInput.trim();

        if (!query) {
            setError("Enter a question or command.");
            return;
        }

        setError(null);
        setActiveGeneration("COPILOT");

        try {
            const result =
                await runProjectCopilotAction({
                    projectId,
                    query,
                });

            if (!result.success) {
                setError(result.error);
                return;
            }

            setContent(result.content);
            setResultType("COPILOT");
            setCopilotInput("");
        } catch {
            setError(
                "Unable to process the project command.",
            );
        } finally {
            setActiveGeneration(null);
        }
    }

    const isGenerating =
        activeGeneration !== null;

    return (
        <section className="mt-8 border-t border-border pt-8">
            <div>
                <h2 className="text-lg font-medium">
                    AI Project Intelligence
                </h2>

                <p className="mt-1 text-sm text-foreground/60">
                    Generate an executive summary, assess
                    project health, or ask Vellum about this
                    project using its latest milestones and
                    financial data.
                </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {activeGeneration === "SUMMARY"
                        ? "Generating Summary..."
                        : "Generate Executive Summary"}
                </button>

                <button
                    type="button"
                    onClick={handleGenerateStatus}
                    disabled={isGenerating}
                    className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {activeGeneration === "STATUS"
                        ? "Checking Status..."
                        : "Check Project Status"}
                </button>
            </div>

            <div className="mt-6">
                <label
                    htmlFor={`project-copilot-${projectId}`}
                    className="text-sm font-medium"
                >
                    Ask Vellum about this project
                </label>

                <p className="mt-1 text-xs text-foreground/50">
                    Try asking for an executive summary,
                    project status, or proposal.
                </p>

                <div className="mt-3 flex flex-col gap-3 md:flex-row">
                    <input
                        id={`project-copilot-${projectId}`}
                        value={copilotInput}
                        onChange={(event) =>
                            setCopilotInput(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" &&
                                !isGenerating
                            ) {
                                handleCopilotCommand();
                            }
                        }}
                        disabled={isGenerating}
                        placeholder="Try: Give me an executive summary of this project"
                        className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                        type="button"
                        onClick={handleCopilotCommand}
                        disabled={
                            isGenerating ||
                            !copilotInput.trim()
                        }
                        className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {activeGeneration === "COPILOT"
                            ? "Thinking..."
                            : "Ask"}
                    </button>
                </div>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mt-4 text-sm text-red-400"
                >
                    {error}
                </p>
            )}

            {content && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                        {resultType === "SUMMARY"
                            ? "Executive Summary"
                            : resultType === "STATUS"
                                ? "Project Status"
                                : "Vellum AI"}
                    </p>

                    <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/80">
                        {content}
                    </div>
                </div>
            )}
        </section>
    );
}