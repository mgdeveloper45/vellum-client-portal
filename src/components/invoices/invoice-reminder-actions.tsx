"use client";

import { useState } from "react";

type InvoiceReminderActionsProps = {
    draft: string;
};

export function InvoiceReminderActions({
    draft,
}: InvoiceReminderActionsProps) {
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
        <div className="mt-6 flex gap-3">
            <button
                type="button"
                onClick={handleCopy}
                className="workspace-accent-button rounded-full px-5 py-3"
            >
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
}