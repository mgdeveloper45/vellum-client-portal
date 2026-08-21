import Link from "next/link";
import { notFound } from "next/navigation";

import { DemoShell } from "@/components/demo/demo-shell";
import { DemoInvoiceReminderActions } from "@/components/demo/demo-invoice-reminder-actions";
import { demoInvoices } from "@/lib/demo/demo-data";

type DemoInvoiceReminderPageProps = {
    params: Promise<{
        invoiceId: string;
    }>;
};

export default async function DemoInvoiceReminderPage({
    params,
}: DemoInvoiceReminderPageProps) {
    const { invoiceId } = await params;

    const invoice = demoInvoices.find(
        (candidate) => candidate.id === invoiceId,
    );

    if (!invoice) {
        notFound();
    }

    if (invoice.status !== "OVERDUE") {
        return (
            <DemoShell>
                <div className="mx-auto max-w-4xl">
                    <Link
                        href={`/demo/invoices/${invoice.id}`}
                        className="text-sm text-foreground/60 transition hover:text-foreground"
                    >
                        ← Back to invoice
                    </Link>

                    <section className="mt-8 rounded-3xl border border-border bg-card p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                            AI Assistant
                        </p>

                        <h1 className="mt-3 text-3xl font-light">
                            No reminder needed
                        </h1>

                        <p className="mt-3 text-foreground/60">
                            {invoice.id} has already been paid, so no payment reminder is
                            required.
                        </p>
                    </section>
                </div>
            </DemoShell>
        );
    }

    const formattedAmount = invoice.amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

    const draft = `Subject: Friendly reminder — ${invoice.id}

Hi ${invoice.clientName},

I hope you're doing well.

I wanted to follow up regarding ${invoice.id} for ${invoice.projectName}. The outstanding balance is ${formattedAmount}.

When you have a moment, please review the invoice and let us know if you have any questions.

Thank you,
Northstar Creative`;

    return (
        <DemoShell>
            <div className="mx-auto max-w-4xl">
                <Link
                    href={`/demo/invoices/${invoice.id}`}
                    className="text-sm text-foreground/60 transition hover:text-foreground"
                >
                    ← Back to invoice
                </Link>

                <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        AI Assistant
                    </p>

                    <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
                        AI Invoice Reminder
                    </h1>

                    <p className="mt-3 max-w-2xl text-foreground/60">
                        Vellum generated a professional payment reminder using the invoice,
                        project, and client context.
                    </p>
                </div>

                <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
                    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-foreground/50">
                                Reminder for
                            </p>

                            <p className="mt-1 font-medium">
                                {invoice.clientName}
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-sm text-foreground/50">
                                Outstanding
                            </p>

                            <p className="mt-1 text-xl font-medium">
                                {formattedAmount}
                            </p>
                        </div>
                    </div>

                    <pre className="mt-6 whitespace-pre-wrap font-sans text-sm leading-7 text-foreground/80">
                        {draft}
                    </pre>
                </section>

                <DemoInvoiceReminderActions draft={draft} />

                <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5">
                    <p className="font-medium">
                        You&apos;re exploring Demo Mode
                    </p>

                    <p className="mt-2 text-sm leading-6 text-foreground/60">
                        In a live workspace, Vellum can generate reminders from your real
                        invoice and client data.
                    </p>

                    <Link
                        href="/sign-in"
                        className="mt-4 inline-block text-sm font-medium workspace-accent-text"
                    >
                        Start using Vellum →
                    </Link>
                </div>
            </div>
        </DemoShell>
    );
}