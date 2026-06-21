"use client";

import { resetPasswordAction } from "@/actions/password-reset-actions";

type ResetPasswordFormProps = {
    token: string;
};

export function ResetPasswordForm({
    token,
}: ResetPasswordFormProps) {
    return (
        <form action={resetPasswordAction} className="mt-6 space-y-4">
            <input type="hidden" name="token" value={token} />

            <input
                name="newPassword"
                type="password"
                required
                placeholder="New password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <button className="w-full rounded-lg bg-accent px-4 py-3 text-black">
                Reset Password
            </button>
        </form>
    );
}