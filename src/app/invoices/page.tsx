import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createInvoiceCheckoutAction } from "@/actions/payment-actions";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

/**
 * Invoices page.
 * Shows all invoices across all projects from PostgreSQL.
 */


export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const projectFilter =
    session.user.role === "ADMIN"
      ? {}
      : {
        clientId: session.user.id,
      };

  const invoices = await prisma.invoice.findMany({
    where: {
      project: projectFilter,
    },
    include: {
      project: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <BrandedDashboardShell>
      <div>
        <h1 className="text-3xl font-light">Invoices</h1>
        <p className="mt-2 text-foreground/70">
          Track client invoices, payment status, and related projects.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium">
                  ${invoice.amount.toLocaleString()}
                </h2>

                <p className="mt-2 text-sm text-foreground/70">
                  {invoice.project.name}
                </p>

                <p className="mt-1 text-sm text-foreground/50">
                  Client: {invoice.project.client.firstName}{" "}
                  {invoice.project.client.lastName}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-sm text-accent">
                  {invoice.paid ? "Paid" : "Unpaid"}
                </span>

                {!invoice.paid && (
                  <form action={createInvoiceCheckoutAction}>
                    <input
                      type="hidden"
                      name="invoiceId"
                      value={invoice.id}
                    />

                    <button className="workspace-accent-button rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-90">
                      Pay Now
                    </button>
                  </form>
                )}
              </div>
            </div>

            <p className="mt-5 text-xs text-foreground/50">
              Created {invoice.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </BrandedDashboardShell>
  );
}