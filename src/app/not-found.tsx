import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-6">
            <section className="max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                    404
                </p>

                <h1 className="mt-3 text-3xl font-light">Page not found</h1>

                <p className="mt-4 text-foreground/60">
                    The page you’re looking for doesn’t exist or may have moved.
                </p>

                <Link
                    href="/dashboard"
                    className="workspace-accent-button mt-8 inline-block rounded-full px-5 py-3 text-sm font-medium"
                >
                    Go to Dashboard
                </Link>
            </section>
        </main>
    );
}