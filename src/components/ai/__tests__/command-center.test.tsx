// @vitest-environment jsdom

import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    confirmAICommandAction,
    runAICommandAction,
} from "@/actions/ai-command-actions";
import { AICommandCenter } from "../command-center";

vi.mock("@/actions/ai-command-actions", () => ({
    runAICommandAction: vi.fn(),
    confirmAICommandAction: vi.fn(),
}));

const mockedRunAICommandAction =
    vi.mocked(runAICommandAction);

const mockedConfirmAICommandAction =
    vi.mocked(confirmAICommandAction);

describe("AICommandCenter", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders a normal Copilot answer", async () => {
        mockedRunAICommandAction.mockResolvedValue({
            type: "ANSWER",
            message: "Projected revenue is $25,000.",
        });

        render(<AICommandCenter />);

        fireEvent.change(
            screen.getByRole("textbox", {
                name: "AI command",
            }),
            {
                target: {
                    value: "How is revenue doing?",
                },
            },
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Run",
            }),
        );

        expect(
            await screen.findByText(
                "Projected revenue is $25,000.",
            ),
        ).toBeTruthy();

        expect(
            mockedRunAICommandAction,
        ).toHaveBeenCalledWith(
            "How is revenue doing?",
        );
    });

    it("renders confirmation controls for an action", async () => {
        mockedRunAICommandAction.mockResolvedValue({
            type: "CONFIRMATION",
            action: "CREATE_BOOKING",
            message:
                'I can perform the action "CREATE_BOOKING". Would you like me to continue?',
            command: "Schedule a booking for tomorrow.",
        });

        render(<AICommandCenter />);

        fireEvent.change(
            screen.getByRole("textbox", {
                name: "AI command",
            }),
            {
                target: {
                    value:
                        "Schedule a booking for tomorrow.",
                },
            },
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Run",
            }),
        );

        expect(
            await screen.findByText(
                "Confirmation required",
            ),
        ).toBeTruthy();

        expect(
            await screen.findByRole("button", {
                name: "Cancel",
            }),
        ).toBeTruthy();

        expect(
            await screen.findByRole("button", {
                name: "Confirm",
            }),
        ).toBeTruthy();
    });

    it("dismisses confirmation when Cancel is clicked", async () => {
        mockedRunAICommandAction.mockResolvedValue({
            type: "CONFIRMATION",
            action: "CREATE_BOOKING",
            message:
                'I can perform the action "CREATE_BOOKING". Would you like me to continue?',
            command: "Schedule a booking for tomorrow.",
        });

        render(<AICommandCenter />);

        fireEvent.change(
            screen.getByRole("textbox", {
                name: "AI command",
            }),
            {
                target: {
                    value: "Schedule a booking.",
                },
            },
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Run",
            }),
        );

        await screen.findByText(
            "Confirmation required",
        );

        fireEvent.click(
            await screen.findByRole("button", {
                name: "Cancel",
            }),
        );

        await waitFor(() => {
            expect(
                screen.queryByText(
                    "Confirmation required",
                ),
            ).toBeNull();
        });
    });

    it("enters the safe state when Confirm is clicked", async () => {
        mockedRunAICommandAction.mockResolvedValue({
            type: "CONFIRMATION",
            action: "UPDATE_PROJECT",
            message:
                'I can perform the action "UPDATE_PROJECT". Would you like me to continue?',
            command: "Update this project.",
        });

        mockedConfirmAICommandAction.mockResolvedValue({
            success: false,
            message:
                "Confirmed UPDATE_PROJECT, but execution is not enabled for this action yet.",
        });

        render(<AICommandCenter />);

        fireEvent.change(
            screen.getByRole("textbox", {
                name: "AI command",
            }),
            {
                target: {
                    value: "Update this project.",
                },
            },
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Run",
            }),
        );

        await screen.findByText(
            "Confirmation required",
        );

        fireEvent.click(
            await screen.findByRole("button", {
                name: "Confirm",
            }),
        );

        await waitFor(() => {
            expect(
                mockedConfirmAICommandAction,
            ).toHaveBeenCalledWith(
                "Update this project.",
            );
        });

        expect(
            await screen.findByText(
                "Confirmed UPDATE_PROJECT, but execution is not enabled for this action yet.",
            ),
        ).toBeTruthy();

        expect(
            screen.queryByText(
                "Confirmation required",
            ),
        ).toBeNull();
    });

    it("clears the command input after running", async () => {
        mockedRunAICommandAction.mockResolvedValue({
            type: "ANSWER",
            message: "Workspace looks healthy.",
        });

        render(<AICommandCenter />);

        const input = screen.getByRole("textbox", {
            name: "AI command",
        });

        fireEvent.change(input, {
            target: {
                value: "Summarize my workspace.",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Run",
            }),
        );

        await screen.findByText(
            "Workspace looks healthy.",
        );

        expect(
            (input as HTMLInputElement).value,
        ).toBe("");
    });
});