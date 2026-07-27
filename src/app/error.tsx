"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Application route error",
        error: {
          message: error.message,
          digest: error.digest,
          ...(process.env.NODE_ENV !== "production"
            ? { stack: error.stack }
            : {}),
        },
      }),
    );
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <section className="max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-light">
          Vellum hit an unexpected error.
        </h1>

        <p className="mt-4 text-foreground/60">
          Please try again. If this keeps happening, our team can investigate
          using the error reference.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-foreground/40">
            Reference: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="workspace-accent-button mt-8 rounded-full px-5 py-3 text-sm font-medium"
        >
          Try again
        </button>
      </section>
    </main>
  );
}