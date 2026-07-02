import { draftInvoiceReminderEmail } from "@/lib/services/ai/email-drafter";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

export default async function AIInvoiceReminderPage() {
    // Temporary demo data until we connect real invoices.
    const draft = await draftInvoiceReminderEmail({
        clientName: "Sarah Johnson",
        businessName: "Vellum",
        projectName: "Website Redesign",
        amount: 2500,
        invoiceId: "INV-1042",
    });

    return (
        <BrandedDashboardShell>
            <div className="max-w-4xl">
                <h1 className="text-3xl font-light">
                    AI Invoice Reminder
                </h1>

                <p className="mt-2 text-foreground/60">
                    Review the draft before sending.
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