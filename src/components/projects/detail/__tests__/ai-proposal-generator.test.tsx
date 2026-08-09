// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    generateProposalDraftAction,
    saveProposalDraftAction,
} from "@/actions/proposal-actions";

import { AiProposalGenerator } from "../ai-proposal-generator";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: refreshMock,
    }),
}));

vi.mock("@/actions/proposal-actions", () => ({
    generateProposalDraftAction: vi.fn(),
    saveProposalDraftAction: vi.fn(),
}));

const generateProposalMock = vi.mocked(
    generateProposalDraftAction,
);

const saveProposalMock = vi.mocked(
    saveProposalDraftAction,
);

function fillGenerationForm() {
    fireEvent.change(
        screen.getByLabelText("Project description"),
        {
            target: {
                value: "Design and build a new client website.",
            },
        },
    );

    fireEvent.change(
        screen.getByLabelText("Estimated price"),
        {
            target: {
                value: "8500",
            },
        },
    );

    fireEvent.change(
        screen.getByLabelText("Estimated timeline"),
        {
            target: {
                value: "6 weeks",
            },
        },
    );
}

describe("AiProposalGenerator", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("generates a proposal draft", async () => {
        generateProposalMock.mockResolvedValue({
            success: true,
            title: "Website Redesign Proposal",
            content: "Generated proposal content.",
        });

        render(
            <AiProposalGenerator projectId="project-1" />,
        );

        fillGenerationForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Generate with AI",
            }),
        );

        await waitFor(() => {
            expect(generateProposalMock).toHaveBeenCalledWith({
                projectId: "project-1",
                projectDescription:
                    "Design and build a new client website.",
                estimatedPrice: 8500,
                estimatedTimeline: "6 weeks",
            });
        });

        expect(
            await screen.findByDisplayValue(
                "Website Redesign Proposal",
            ),
        ).toBeTruthy();

        expect(
            screen.getByDisplayValue(
                "Generated proposal content.",
            ),
        ).toBeTruthy();;
    });

    it("shows an error when generation fails", async () => {
        generateProposalMock.mockResolvedValue({
            success: false,
            error: "Unable to generate proposal.",
        });

        render(
            <AiProposalGenerator projectId="project-1" />,
        );

        fillGenerationForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Generate with AI",
            }),
        );

        const alert = await screen.findByRole("alert");

        expect(alert.textContent).toContain(
            "Unable to generate proposal.",
        );
    });

    it("validates the generation form before calling the server", async () => {
        render(
            <AiProposalGenerator projectId="project-1" />,
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Generate with AI",
            }),
        );

        const alert = screen.getByRole("alert");

        expect(alert.textContent).toContain(
            "Enter a project description.",
        );

        expect(generateProposalMock).not.toHaveBeenCalled();
    });

    it("saves edited proposal content", async () => {
        generateProposalMock.mockResolvedValue({
            success: true,
            title: "Website Redesign Proposal",
            content: "Generated proposal content.",
        });

        saveProposalMock.mockResolvedValue({
            success: true,
            proposalId: "proposal-1",
        });

        render(
            <AiProposalGenerator projectId="project-1" />,
        );

        fillGenerationForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Generate with AI",
            }),
        );

        const titleInput =
            await screen.findByDisplayValue(
                "Website Redesign Proposal",
            );

        const draftInput =
            screen.getByDisplayValue(
                "Generated proposal content.",
            );

        fireEvent.change(titleInput, {
            target: {
                value: "Updated Proposal",
            },
        });

        fireEvent.change(draftInput, {
            target: {
                value: "Edited proposal content.",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Save Proposal",
            }),
        );

        await waitFor(() => {
            expect(saveProposalMock).toHaveBeenCalledWith({
                projectId: "project-1",
                title: "Updated Proposal",
                content: "Edited proposal content.",
            });
        });

        expect(
            await screen.findByText("Proposal saved."),
        ).toBeTruthy();

        expect(refreshMock).toHaveBeenCalledTimes(1);
    });

    it("disables saving after a successful save", async () => {
        generateProposalMock.mockResolvedValue({
            success: true,
            title: "Website Redesign Proposal",
            content: "Generated proposal content.",
        });

        saveProposalMock.mockResolvedValue({
            success: true,
            proposalId: "proposal-1",
        });

        render(
            <AiProposalGenerator projectId="project-1" />,
        );

        fillGenerationForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Generate with AI",
            }),
        );

        const saveButton = await screen.findByRole(
            "button",
            {
                name: "Save Proposal",
            },
        );

        fireEvent.click(saveButton);

        const savedButton = await screen.findByRole(
            "button",
            {
                name: "Saved",
            },
        );

        expect(
            (savedButton as HTMLButtonElement).disabled,
        ).toBe(true);

        expect(saveProposalMock).toHaveBeenCalledTimes(1);

        fireEvent.click(savedButton);

        expect(saveProposalMock).toHaveBeenCalledTimes(1);
    });

    it("shows an error when saving fails", async () => {
        generateProposalMock.mockResolvedValue({
            success: true,
            title: "Website Redesign Proposal",
            content: "Generated proposal content.",
        });

        saveProposalMock.mockResolvedValue({
            success: false,
            error: "Unable to save proposal.",
        });

        render(
            <AiProposalGenerator projectId="project-1" />,
        );

        fillGenerationForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Generate with AI",
            }),
        );

        const saveButton = await screen.findByRole(
            "button",
            {
                name: "Save Proposal",
            },
        );

        fireEvent.click(saveButton);

        const alert = await screen.findByRole("alert");

        expect(alert.textContent).toContain(
            "Unable to save proposal.",
        );

        expect(refreshMock).not.toHaveBeenCalled();
    });
});