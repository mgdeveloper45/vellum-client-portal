"use client";

import Link from "next/link";
import { useDebounce } from "use-debounce";
import { getKeyboardShortcutLabel } from "@/lib/platform";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import {
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react";
import {
    searchWorkspaceAction,
    type SearchResult,
} from "@/actions/search-actions";

export function WorkspaceSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const shortcut = useMemo(() => getKeyboardShortcutLabel(), []);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isPending, startTransition] = useTransition();

    function handleSearch(value: string) {
        setQuery(value);

        if (value.length < 2) {
            setResults([]);
        }
    }

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

    return (
        <div className="relative w-full max-w-xl">
            <input
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search clients, bookings, projects..."
                aria-label="Search workspace"
                className="w-full rounded-full border border-border bg-card px-5 py-3 pr-16 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-foreground/40"
            />

            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-border bg-muted px-2 py-1 text-xs text-foreground/50">
                {shortcut}
            </div>

            {query.length >= 2 && (
                <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl border border-border bg-card p-3 shadow-xl">
                    {isPending && (
                        <div className="px-3 py-4 text-center text-sm text-foreground/60">
                            Searching workspace…
                        </div>
                    )}

                    {!isPending && results.length === 0 && (
                        <ExecutiveEmptyState
                            title="No results found"
                            description={`No clients, bookings, or projects matched “${query}”.`}
                            className="!min-h-0 !rounded-xl px-4 py-6"
                        />
                    )}

                    {!isPending &&
                        results.map((result) => (
                            <Link
                                key={`${result.type}-${result.id}`}
                                href={result.href}
                                className="block rounded-xl px-3 py-3 transition hover:bg-muted"
                                onClick={() => {
                                    setQuery("");
                                    setResults([]);
                                }}
                            >
                                <p className="text-xs uppercase tracking-wide text-foreground/40">
                                    {result.type}
                                </p>

                                <p className="mt-1 font-medium">
                                    {result.title}
                                </p>

                                <p className="mt-1 truncate text-sm text-foreground/60">
                                    {result.subtitle}
                                </p>
                            </Link>
                        ))}
                </div>
            )}
        </div>
    );
}