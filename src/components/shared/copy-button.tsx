"use client";

import { useState } from "react";

type CopyButtonProps = {
    value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(value);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-border px-5 py-3 text-sm transition hover:bg-muted"
        >
            {copied ? "Copied!" : "Copy Link"}
        </button>
    );
}