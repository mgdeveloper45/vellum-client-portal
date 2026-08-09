"use client";

import { useState } from "react";
import {
    generateProposalDraftAction,
    saveProposalDraftAction,
} from "@/actions/proposal-actions";
import { useRouter } from "next/navigation";

type AiProposalGeneratorProps = {
    projectId: string;
};

export function AiProposalGenerator({
    projectId,
}: AiProposalGeneratorProps) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const [projectDescription, setProjectDescription] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [estimatedTimeline, setEstimatedTimeline] = useState("");

    const [draft, setDraft] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);


    async function handleGenerate() {
        setHasSaved(false);
        setSaveMessage(null);
        setError(null);
        setIsGenerating(true);

        try {
            const price = Number(estimatedPrice);

            if (!projectDescription.trim()) {
                setError("Enter a project description.");
                return;
            }

            if (
                estimatedPrice.trim() === "" ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                setError("Enter a valid estimated price.");
                return;
            }

            if (!estimatedTimeline.trim()) {
                setError("Enter an estimated timeline.");
                return;
            }

            const result = await generateProposalDraftAction({
                projectId,
                projectDescription: projectDescription.trim(),
                estimatedPrice: price,
                estimatedTimeline: estimatedTimeline.trim(),
            });

            if (!result.success) {
                setError(result.error);
                return;
            }

            setDraft(result.content);
            setTitle(result.title);
            setSaveMessage(null);

        } catch {
            setError("Unable to generate proposal.");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleSave() {
        setError(null);
        setSaveMessage(null);

        const normalizedTitle = title.trim();
        const normalizedDraft = draft.trim();

        if (!normalizedTitle) {
            setError("Enter a proposal title.");
            return;
        }

        if (!normalizedDraft) {
            setError("Generate or enter proposal content before saving.");
            return;
        }

        setIsSaving(true);

        try {
            const result = await saveProposalDraftAction({
                projectId,
                title: normalizedTitle,
                content: normalizedDraft,
            });

            if (!result.success) {
                setError(result.error);
                return;
            }

            setHasSaved(true);
            setSaveMessage("Proposal saved.");
            router.refresh();

        } catch {
            setError("Unable to save proposal.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="mt-4 rounded-2xl border border-border bg-card p-6">
            <div>
                <h3 className="font-medium">
                    Generate Proposal with AI
                </h3>

                <p className="mt-1 text-sm text-foreground/60">
                    Provide a few details and Vellum will prepare a proposal draft.
                </p>
            </div>

            <div className="mt-5 space-y-4">
                <div>
                    <label
                        htmlFor={`proposal-description-${projectId}`}
                        className="text-sm font-medium"
                    >
                        Project description
                    </label>

                    <textarea
                        id={`proposal-description-${projectId}`}
                        value={projectDescription}
                        onChange={(event) =>
                            setProjectDescription(event.target.value)
                        }
                        placeholder="Describe the work, goals, and important deliverables."
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor={`proposal-price-${projectId}`}
                            className="text-sm font-medium"
                        >
                            Estimated price
                        </label>

                        <input
                            id={`proposal-price-${projectId}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={estimatedPrice}
                            onChange={(event) =>
                                setEstimatedPrice(event.target.value)
                            }
                            placeholder="8500"
                            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor={`proposal-timeline-${projectId}`}
                            className="text-sm font-medium"
                        >
                            Estimated timeline
                        </label>

                        <input
                            id={`proposal-timeline-${projectId}`}
                            value={estimatedTimeline}
                            onChange={(event) =>
                                setEstimatedTimeline(event.target.value)
                            }
                            placeholder="6 weeks"
                            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isGenerating
                        ? "Generating..."
                        : draft
                            ? "Regenerate Draft"
                            : "Generate with AI"}
                </button>

                {error && (
                    <p
                        role="alert"
                        className="text-sm text-red-400"
                    >
                        {error}
                    </p>
                )}

                {draft && (
                    <div className="border-t border-border pt-5">
                        <label
                            htmlFor={`proposal-draft-${projectId}`}
                            className="text-sm font-medium"
                        >
                            Proposal draft
                        </label>

                        <p className="mt-1 text-xs text-foreground/50">
                            Review and edit the AI-generated draft before saving or sending it.
                        </p>

                        <div className="mt-4">
                            <label
                                htmlFor={`proposal-title-${projectId}`}
                                className="text-sm font-medium"
                            >
                                Proposal title
                            </label>

                            <input
                                id={`proposal-title-${projectId}`}
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                            />
                        </div>

                        <textarea
                            id={`proposal-draft-${projectId}`}
                            value={draft}
                            onChange={(event) =>
                                setDraft(event.target.value)
                            }
                            rows={18}
                            className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none"
                        />

                        <div className="mt-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving || hasSaved}
                                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving
                                    ? "Saving..."
                                    : hasSaved
                                        ? "Saved"
                                        : "Save Proposal"}
                            </button>

                            {saveMessage && (
                                <p className="text-sm text-foreground/60">
                                    {saveMessage}
                                </p>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}