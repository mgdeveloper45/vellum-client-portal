import { createInvoiceCheckoutAction } from "@/actions/payment-actions";
import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { getInvoicesService } from "@/lib/services/invoice/composition/invoice-services";
import Link from "next/link";

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return null;
  }

  const invoices =
    await getInvoicesService.execute({
      workspaceId,
      clientId:
        session.user.role === "ADMIN"
          ? undefined
          : session.user.id,
    });

  if (invoices.length === 0) {
    return (
      <BrandedDashboardShell>
        <h1 className="text-3xl font-light">
          Invoices
        </h1>

        <p className="mt-2 text-foreground/70">
          Track client invoices,
          payment status, and
          related projects.
        </p>

        <ExecutiveEmptyState
          className="mt-10 min-h-[360px]"
          title="No invoices yet"
          description="Invoices generated from completed projects will appear here."
        />
      </BrandedDashboardShell>
    );
  }

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );

  const paidRevenue = invoices
    .filter((invoice) => invoice.paid)
    .reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );

  const outstandingRevenue =
    totalRevenue - paidRevenue;

  const unpaidInvoices = invoices.filter(
    (invoice) => !invoice.paid,
  ).length;

  return (
    <BrandedDashboardShell>
      <div>
        <h1 className="text-3xl font-light">
          Invoices
        </h1>

        <p className="mt-2 text-foreground/70">
          Track client invoices,
          payment status, and
          related projects.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-foreground/60">
            Total Revenue
          </p>

          <p className="mt-2 text-3xl font-semibold">
            $
            {totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-foreground/60">
            Paid Revenue
          </p>

          <p className="mt-2 text-3xl font-semibold text-emerald-600">
            $
            {paidRevenue.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-foreground/60">
            Outstanding
          </p>

          <p className="mt-2 text-3xl font-semibold">
            $
            {outstandingRevenue.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-foreground/60">
            Unpaid Invoices
          </p>

          <p className="mt-2 text-3xl font-semibold">
            {unpaidInvoices}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        {invoices.map((invoice) => (
          <article
            key={invoice.id}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-4xl font-light">
                  $
                  {invoice.amount.toLocaleString()}
                </p>

                <h2 className="mt-3 text-xl font-medium">
                  {invoice.project.name}
                </h2>

                <p className="mt-2 text-sm text-foreground/60">
                  Client:{" "}
                  {
                    invoice.project
                      .client
                      .firstName
                  }{" "}
                  {
                    invoice.project
                      .client
                      .lastName
                  }
                </p>

                <p className="mt-3 text-xs text-foreground/45">
                  Created{" "}
                  {invoice.createdAt.toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <StatusBadge
                  variant={
                    invoice.paid
                      ? "success"
                      : "warning"
                  }
                >
                  {invoice.paid
                    ? "Paid"
                    : "Awaiting Payment"}
                </StatusBadge>

                {!invoice.paid && (
                  <>
                    <form
                      action={
                        createInvoiceCheckoutAction
                      }
                    >
                      <input
                        type="hidden"
                        name="invoiceId"
                        value={
                          invoice.id
                        }
                      />

                      <button
                        type="submit"
                        className="workspace-accent-button rounded-full px-5 py-2.5 text-sm font-medium"
                      >
                        Pay Invoice
                      </button>
                    </form>

                    <Link
                      href={`/ai/invoice-reminder/${invoice.id}`}
                      className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
                    >
                      ✨ Generate AI Reminder
                    </Link>
                  </>
                )}

                <a
                  href={`/invoices/${invoice.id}/pdf`}
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </BrandedDashboardShell>
  );
}