"use client";

import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { useEffect, useState, useTransition } from "react";
import { searchWorkspaceAction } from "@/actions/search-actions";
import type { SearchResult } from "@/lib/services/search/workspace-search-service";


export function CommandPalette() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [debouncedQuery] = useDebounce(query, 300);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {
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
            const nextResults =
                await searchWorkspaceAction(debouncedQuery);

            setResults(nextResults);
        });
    }, [debouncedQuery]);

    function handleQueryChange(value: string) {
        setQuery(value);
        setSelectedIndex(0);

        if (value.length < 2) {
            setResults([]);
        }
    }

    function closePalette() {
        setOpen(false);
        setQuery("");
        setResults([]);
        setSelectedIndex(0);
    }

    function handleInputKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>,
    ) {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            setSelectedIndex((current) =>
                results.length === 0
                    ? 0
                    : Math.min(current + 1, results.length - 1),
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            setSelectedIndex((current) =>
                Math.max(current - 1, 0),
            );
        }

        if (event.key === "Enter" && results[selectedIndex]) {
            event.preventDefault();

            router.push(results[selectedIndex].href);
            closePalette();
        }
    }

    if (!open) {
        return null;
    }

    const groupedResults = results.reduce(
        (groups, result) => {
            if (!groups[result.type]) {
                groups[result.type] = [];
            }

            groups[result.type].push(result);

            return groups;
        },
        {} as Record<SearchResult["type"], SearchResult[]>,
    );

    const sectionTitles: Record<SearchResult["type"], string> = {
        ACTION: "⚡ Actions",
        CLIENT: "👤 Clients",
        PROJECT: "📁 Projects",
        BOOKING: "📅 Bookings",
        INVOICE: "💰 Invoices",
        MESSAGE: "💬 Messages",
        SERVICE: "🛠 Services",
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Vellum command palette"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    closePalette();
                }
            }}
        >
            <div className="mx-auto mt-24 max-w-2xl rounded-3xl border border-border bg-card p-4 shadow-2xl">
                <input
                    autoFocus
                    value={query}
                    onKeyDown={handleInputKeyDown}
                    onChange={(event) =>
                        handleQueryChange(event.target.value)
                    }
                    placeholder="Search clients, bookings, projects, invoices..."
                    aria-label="Search Vellum"
                    className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-foreground/40"
                />

                <div className="mt-4 max-h-96 overflow-y-auto">
                    {query.length < 2 && (
                        <div className="px-3 py-8 text-center">
                            <p className="text-sm font-medium">
                                Search across Vellum
                            </p>

                            <p className="mt-2 text-sm text-foreground/60">
                                Enter at least two characters to find clients,
                                bookings, projects, invoices, and actions.
                            </p>
                        </div>
                    )}

                    {query.length >= 2 && isPending && (
                        <div className="px-3 py-8 text-center text-sm text-foreground/60">
                            Searching workspace…
                        </div>
                    )}

                    {query.length >= 2 &&
                        !isPending &&
                        results.length === 0 && (
                            <ExecutiveEmptyState
                                title="No results found"
                                description={`No clients, bookings, projects, invoices, or actions matched “${query}”.`}
                                className="!min-h-0 !rounded-2xl px-5 py-8"
                            />
                        )}

                    {!isPending &&
                        Object.entries(groupedResults).map(
                            ([type, group]) => (
                                <div
                                    key={type}
                                    className="mb-4 last:mb-0"
                                >
                                    <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wide text-foreground/40">
                                        {
                                            sectionTitles[
                                            type as SearchResult["type"]
                                            ]
                                        }
                                    </p>

                                    <div className="space-y-1">
                                        {group.map((result) => {
                                            const flatIndex = results.findIndex(
                                                (item) =>
                                                    item.type === result.type &&
                                                    item.id === result.id,
                                            );

                                            return (
                                                <Link
                                                    key={`${result.type}-${result.id}`}
                                                    href={result.href}
                                                    onClick={closePalette}
                                                    className={
                                                        flatIndex === selectedIndex
                                                            ? "block rounded-2xl bg-muted px-4 py-3 transition"
                                                            : "block rounded-2xl px-4 py-3 transition hover:bg-muted"
                                                    }
                                                >
                                                    <p className="font-medium">
                                                        {result.title}
                                                    </p>

                                                    <p className="mt-1 truncate text-sm text-foreground/60">
                                                        {result.subtitle}
                                                    </p>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ),
                        )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-foreground/50">
                    <div className="flex items-center gap-3">
                        <span>↑ ↓ Navigate</span>
                        <span>Enter Open</span>
                    </div>

                    <span>Esc Close</span>
                </div>
            </div>
        </div>
    );
}