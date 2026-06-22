"use client";

import { useActionState } from "react";
import {
    requestPasswordResetAction,
    type PasswordResetState,
} from "@/actions/password-reset-actions";

const initialState: PasswordResetState = {};

export function ForgotPasswordForm() {
    const [state, formAction, isPending] = useActionState(
        requestPasswordResetAction,
        initialState
    );

    return (
        <form action={formAction} className="mt-6 space-y-4">
            <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            {state.error && (
                <p className="text-sm text-red-400">{state.error}</p>
            )}

            {state.success && (
                <p className="text-sm text-green-400">{state.success}</p>
            )}

            <button
                disabled={isPending}
                className="w-full rounded-lg bg-accent px-4 py-3 text-black disabled:opacity-50"
            >
                {isPending ? "Creating link..." : "Create Reset Link"}
            </button>
        </form>
    );
}