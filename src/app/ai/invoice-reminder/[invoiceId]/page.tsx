import Link from "next/link";
import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { getAIInvoiceReminderQuery } from "@/lib/queries/invoices/get-ai-invoice-reminder-query";
import { draftInvoiceReminderEmail } from "@/lib/services/ai/email-drafter";

type AIInvoiceReminderPageProps = {
  params: Promise<{
    invoiceId: string;
  }>;
};

export default async function AIInvoiceReminderPage({
  params,
}: AIInvoiceReminderPageProps) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const { invoiceId } = await params;

  const workspaceId = await getCurrentUserWorkspaceQuery(session.user.id);

  if (!workspaceId) {
    return null;
  }

  const invoice = await getAIInvoiceReminderQuery(
    invoiceId,
    workspaceId,
  );

  if (!invoice) {
    return (
      <BrandedDashboardShell>
        <h1 className="text-3xl font-light">Invoice not found</h1>

        <Link
          href="/invoices"
          className="mt-4 inline-block workspace-accent-text"
        >
          Back to invoices
        </Link>
      </BrandedDashboardShell>
    );
  }

  const clientName = `${invoice.project.client.firstName} ${invoice.project.client.lastName}`;

  const businessName =
    invoice.project.workspace?.companyName ??
    invoice.project.workspace?.name ??
    "Vellum";

  const draft = await draftInvoiceReminderEmail({
    clientName,
    businessName,
    projectName: invoice.project.name,
    amount: Number(invoice.amount),
    invoiceId: invoice.id,
  });

  return (
    <BrandedDashboardShell>
      <div className="max-w-4xl">
        <Link
          href="/invoices"
          className="workspace-accent-text text-sm"
        >
          ← Back to invoices
        </Link>

        <h1 className="mt-4 text-3xl font-light">
          AI Invoice Reminder
        </h1>

        <p className="mt-2 text-foreground/60">
          Review this AI-generated reminder before sending.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-8">
          <pre className="whitespace-pre-wrap text-sm leading-7">
            {draft}
          </pre>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="workspace-accent-button rounded-full px-5 py-3">
            Copy
          </button>

          <button className="rounded-full border border-border px-5 py-3">
            Send Later
          </button>
        </div>
      </div>
    </BrandedDashboardShell>
  );
}