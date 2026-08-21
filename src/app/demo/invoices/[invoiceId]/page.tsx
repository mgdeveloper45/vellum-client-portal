import Link from "next/link";
import { notFound } from "next/navigation";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoInvoices } from "@/lib/demo/demo-data";

type DemoInvoiceDetailPageProps = {
  params: Promise<{
    invoiceId: string;
  }>;
};

const statusClasses = {
  OVERDUE: "bg-red-500/10 text-red-600",
  PAID: "bg-emerald-500/10 text-emerald-600",
} as const;

export default async function DemoInvoiceDetailPage({
  params,
}: DemoInvoiceDetailPageProps) {
  const { invoiceId } = await params;

  const invoice = demoInvoices.find(
    (candidate) => candidate.id === invoiceId,
  );

  if (!invoice) {
    notFound();
  }

  const formattedAmount = invoice.amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const isOverdue = invoice.status === "OVERDUE";

  return (
    <DemoShell>
      <div className="mx-auto max-w-6xl">
        <Link
          href="/demo/invoices"
          className="text-sm text-foreground/60 transition hover:text-foreground"
        >
          ← Back to invoices
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Invoice
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-light tracking-tight sm:text-4xl">
                {invoice.id}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusClasses[
                    invoice.status as keyof typeof statusClasses
                  ]
                }`}
              >
                {invoice.status}
              </span>
            </div>

            <p className="mt-3 text-foreground/60">
              {invoice.projectName}
            </p>
          </div>

          <div className="lg:text-right">
            <p className="text-sm text-foreground/50">
              Amount
            </p>

            <p className="mt-1 text-4xl font-light">
              {formattedAmount}
            </p>

            <p className="mt-2 text-sm text-foreground/50">
              {invoice.dueLabel}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="border-b border-border pb-6">
              <p className="text-sm text-foreground/50">
                Bill to
              </p>

              <p className="mt-2 text-xl font-medium">
                {invoice.clientName}
              </p>
            </div>

            <div className="py-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-medium">
                    {invoice.projectName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-foreground/55">
                    Professional services and project work.
                  </p>
                </div>

                <p className="shrink-0 font-medium">
                  {formattedAmount}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <p className="text-foreground/60">
                  Total
                </p>

                <p className="text-2xl font-light">
                  {formattedAmount}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-foreground/60">
                  Amount due
                </p>

                <p className="text-2xl font-medium">
                  {isOverdue ? formattedAmount : "$0"}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Payment Status
              </p>

              <h2 className="mt-3 text-2xl font-light">
                {isOverdue
                  ? "Payment needs attention"
                  : "Invoice paid"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-foreground/60">
                {isOverdue
                  ? `${invoice.id} is overdue. Vellum can help you follow up with the client and recover the outstanding balance.`
                  : `${invoice.id} has been paid and no collection action is required.`}
              </p>

              {isOverdue && (
                <Link
                  href={`/demo/invoices/${invoice.id}/reminder`}
                  className="workspace-accent-button mt-6 block w-full rounded-2xl px-5 py-3 text-center font-medium"
                >
                  Draft AI Reminder
                </Link>
              )}
            </section>

            <section className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm text-foreground/50">
                Project
              </p>

              <p className="mt-2 font-medium">
                {invoice.projectName}
              </p>

              <p className="mt-5 text-sm text-foreground/50">
                Client
              </p>

              <p className="mt-2 font-medium">
                {invoice.clientName}
              </p>

              <Link
                href="/demo/projects"
                className="mt-6 inline-block text-sm font-medium workspace-accent-text"
              >
                Explore projects →
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </DemoShell>
  );
}