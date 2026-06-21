"use client";

import { useActionState } from "react";
import {
    changePasswordAction,
    type ChangePasswordState,
} from "@/actions/security-actions";

const initialState: ChangePasswordState = {};

export function ChangePasswordForm() {
    const [state, formAction, isPending] = useActionState(
        changePasswordAction,
        initialState
    );

    return (
        <form action={formAction} className="mt-4 space-y-3">
            <input
                type="password"
                name="currentPassword"
                required
                placeholder="Current password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
                type="password"
                name="newPassword"
                required
                placeholder="New password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm new password"
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
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
                {isPending ? "Updating..." : "Change Password"}
            </button>
        </form>
    );
}