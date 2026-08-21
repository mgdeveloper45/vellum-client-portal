"use client";

import { useState } from "react";

type DemoInvoiceReminderActionsProps = {
    draft: string;
};

export function DemoInvoiceReminderActions({
    draft,
}: DemoInvoiceReminderActionsProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(draft);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            setCopied(false);
        }
    }

    return (
        <div className="mt-6 flex flex-wrap gap-3">
            <button
                type="button"
                onClick={handleCopy}
                className="workspace-accent-button rounded-full px-5 py-3"
            >
                {copied ? "Copied" : "Copy Reminder"}
            </button>

            <a
                href="/sign-in"
                className="rounded-full border border-border px-5 py-3 transition hover:bg-muted"
            >
                Sign in to send
            </a>
        </div>
    );
}