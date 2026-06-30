"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";
import {
    searchWorkspaceAction,
    type SearchResult,
} from "@/actions/search-actions";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isPending, startTransition] = useTransition();
    const [debouncedQuery] = useDebounce(query, 300);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setOpen((current) => !current);
            }

            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            return;
        }

        startTransition(async () => {
            const nextResults = await searchWorkspaceAction(debouncedQuery);
            setResults(nextResults);
        });
    }, [debouncedQuery]);

    function handleQueryChange(value: string) {
        setQuery(value);

        if (value.length < 2) {
            setResults([]);
        }
    }

    function closePalette() {
        setOpen(false);
        setQuery("");
        setResults([]);
    }

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur-sm">
            <div className="mx-auto mt-24 max-w-2xl rounded-3xl border border-border bg-card p-4 shadow-2xl">
                <input
                    autoFocus
                    value={query}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    placeholder="Search clients, bookings, projects, invoices..."
                    className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-lg outline-none focus:border-foreground/40"
                />

                <div className="mt-4 max-h-96 overflow-y-auto">
                    {query.length < 2 && (
                        <p className="px-3 py-6 text-center text-sm text-foreground/60">
                            Start typing to search Vellum.
                        </p>
                    )}

                    {query.length >= 2 && isPending && (
                        <p className="px-3 py-6 text-center text-sm text-foreground/60">
                            Searching...
                        </p>
                    )}

                    {query.length >= 2 && !isPending && results.length === 0 && (
                        <p className="px-3 py-6 text-center text-sm text-foreground/60">
                            No results found.
                        </p>
                    )}

                    {!isPending &&
                        results.map((result) => (
                            <Link
                                key={`${result.type}-${result.id}`}
                                href={result.href}
                                onClick={closePalette}
                                className="block rounded-2xl px-4 py-3 transition hover:bg-muted"
                            >
                                <p className="text-xs uppercase tracking-wide text-foreground/40">
                                    {result.type}
                                </p>

                                <p className="mt-1 font-medium">{result.title}</p>

                                <p className="mt-1 truncate text-sm text-foreground/60">
                                    {result.subtitle}
                                </p>
                            </Link>
                        ))}
                </div>

                <div className="mt-4 border-t border-border pt-3 text-xs text-foreground/50">
                    Press Esc to close
                </div>
            </div>
        </div>
    );
}