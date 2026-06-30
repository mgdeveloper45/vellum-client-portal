"use client";

import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
    searchWorkspaceAction,
    type SearchResult,
} from "@/actions/search-actions";

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
        setSelectedIndex(0);

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

    function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            setSelectedIndex((current) =>
                results.length === 0 ? 0 : Math.min(current + 1, results.length - 1),
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            setSelectedIndex((current) => Math.max(current - 1, 0));
        }

        if (event.key === "Enter" && results[selectedIndex]) {
            event.preventDefault();

            router.push(results[selectedIndex].href);
            closePalette();
        }
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
        CLIENT: "👤 Clients",
        PROJECT: "📁 Projects",
        BOOKING: "📅 Bookings",
        INVOICE: "💰 Invoices",
        MESSAGE: "💬 Messages",
        SERVICE: "🛠 Services",
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur-sm">
            <div className="mx-auto mt-24 max-w-2xl rounded-3xl border border-border bg-card p-4 shadow-2xl">
                <input
                    autoFocus
                    value={query}
                    onKeyDown={handleInputKeyDown}
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
                        Object.entries(groupedResults).map(([type, group]) => (
                            <div key={type} className="mb-4 last:mb-0">
                                <p className="mb-2 px-4 text-xs font-medium uppercase tracking-wide text-foreground/40">
                                    {sectionTitles[type as SearchResult["type"]]}
                                </p>

                                <div className="space-y-1">
                                    {group.map((result) => {
                                        const flatIndex = results.findIndex(
                                            (item) => item.type === result.type && item.id === result.id,
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
                                                <p className="font-medium">{result.title}</p>

                                                <p className="mt-1 truncate text-sm text-foreground/60">
                                                    {result.subtitle}
                                                </p>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                </div>

                <div className="mt-4 border-t border-border pt-3 text-xs text-foreground/50">
                    Press Esc to close
                </div>
            </div>
        </div>
    );
}