"use client";

import { useState } from "react";

import {
    generateProjectStatusAction,
    generateProjectSummaryAction,
} from "@/actions/project-ai-actions";

type ProjectAiIntelligenceProps = {
    projectId: string;
};

type ActiveGeneration = "SUMMARY" | "STATUS" | null;

export function ProjectAiIntelligence({
    projectId,
}: ProjectAiIntelligenceProps) {
    const [content, setContent] = useState("");
    const [resultType, setResultType] = useState<
        "SUMMARY" | "STATUS" | null
    >(null);

    const [activeGeneration, setActiveGeneration] =
        useState<ActiveGeneration>(null);

    const [error, setError] = useState<string | null>(null);

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
            setError("Unable to generate project summary.");
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
            setError("Unable to generate project status.");
        } finally {
            setActiveGeneration(null);
        }
    }

    const isGenerating = activeGeneration !== null;

    return (
        <section className="mt-8 border-t border-border pt-8">
            <div>
                <h2 className="text-lg font-medium">
                    AI Project Intelligence
                </h2>

                <p className="mt-1 text-sm text-foreground/60">
                    Generate an executive summary or assess the
                    current health of this project using its latest
                    milestones and financial data.
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
                            : "Project Status"}
                    </p>

                    <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/80">
                        {content}
                    </div>
                </div>
            )}
        </section>
    );
}