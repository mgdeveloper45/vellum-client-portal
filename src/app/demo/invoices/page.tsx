import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoInvoices } from "@/lib/demo/demo-data";

const statusClasses = {
    OVERDUE: "bg-red-500/10 text-red-600",
    PAID: "bg-emerald-500/10 text-emerald-600",
} as const;

export default function DemoInvoicesPage() {
    const outstanding = demoInvoices
        .filter((invoice) => invoice.status !== "PAID")
        .reduce((total, invoice) => total + invoice.amount, 0);

    const collected = demoInvoices
        .filter((invoice) => invoice.status === "PAID")
        .reduce((total, invoice) => total + invoice.amount, 0);

    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Finance
                    </p>

                    <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                        Invoices
                    </h1>

                    <p className="mt-3 max-w-3xl text-foreground/60">
                        Track client invoices, outstanding revenue, and payment status.
                    </p>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Outstanding
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {outstanding.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            })}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Ready for collection
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Collected
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {collected.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            })}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Paid invoices
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Total Invoices
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {demoInvoices.length}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Across active projects
                        </p>
                    </div>
                </section>

                <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
                    <div className="border-b border-border px-6 py-5">
                        <h2 className="text-xl font-medium">
                            Client Invoices
                        </h2>

                        <p className="mt-1 text-sm text-foreground/50">
                            Explore invoice and collection workflows.
                        </p>
                    </div>

                    <div className="divide-y divide-border">
                        {demoInvoices.map((invoice) => {
                            const formattedAmount = invoice.amount.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                            });

                            return (
                                <div
                                    key={invoice.id}
                                    className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="font-medium">
                                                {invoice.id}
                                            </p>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[
                                                    invoice.status as keyof typeof statusClasses
                                                    ]
                                                    }`}
                                            >
                                                {invoice.status}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-lg">
                                            {invoice.projectName}
                                        </p>

                                        <p className="mt-1 text-sm text-foreground/50">
                                            {invoice.clientName} · {invoice.dueLabel}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <p className="text-2xl font-light">
                                            {formattedAmount}
                                        </p>

                                        {invoice.status === "OVERDUE" ? (
                                            <Link
                                                href={`/demo/invoices/${invoice.id}`}
                                                className="workspace-accent-button rounded-2xl px-5 py-3 text-center text-sm font-medium"
                                            >
                                                Review Invoice
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/demo/invoices/${invoice.id}`}
                                                className="rounded-2xl border border-border px-5 py-3 text-center text-sm font-medium transition hover:bg-muted"
                                            >
                                                View Invoice
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </DemoShell>
    );
}