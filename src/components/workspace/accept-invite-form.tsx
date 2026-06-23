"use client";

import { acceptWorkspaceInvitationAction } from "@/actions/workspace-invitation-actions";

type AcceptInviteFormProps = {
    token: string;
    email: string;
};

export function AcceptInviteForm({
    token,
    email,
}: AcceptInviteFormProps) {
    return (
        <form action={acceptWorkspaceInvitationAction} className="mt-8 space-y-4">
            <input type="hidden" name="token" value={token} />

            <input
                name="email"
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground/60"
            />

            <input
                name="firstName"
                required
                placeholder="First name"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
                name="lastName"
                required
                placeholder="Last name"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
                name="password"
                type="password"
                required
                placeholder="Create password"
                className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <button className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-black">
                Accept Invitation
            </button>
        </form>
    );
}