import {
    createInvoiceAction,
    deleteInvoiceAction,
    toggleInvoicePaidAction,
} from "@/actions/invoice-actions";

import type { ProjectDetailViewModel } from "@/lib/services/projects/project-detail-builder";

type ProjectInvoicesProps = {
    projectId: string;
    invoices: ProjectDetailViewModel["project"]["invoices"];
    canManageProject: boolean;
};

export function ProjectInvoices({
    projectId,
    invoices,
    canManageProject,
}: ProjectInvoicesProps) {
    return (
        <section id="invoices" className="mt-10 scroll-mt-6">
            <h2 className="text-xl font-medium">
                Invoices
            </h2>

            {canManageProject && (
                <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                    <form
                        action={createInvoiceAction}
                        className="space-y-3"
                    >
                        <input
                            type="hidden"
                            name="projectId"
                            value={projectId}
                        />

                        <input
                            name="amount"
                            type="number"
                            min="1"
                            step="0.01"
                            required
                            placeholder="Invoice amount"
                            className="w-full rounded-lg border border-border bg-background px-4 py-3"
                        />

                        <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                            Create Invoice
                        </button>
                    </form>
                </div>
            )}

            <div className="mt-4 grid gap-3">
                {invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="rounded-xl border border-border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-medium">
                                $
                                {invoice.amount.toLocaleString()}
                            </p>

                            {canManageProject ? (
                                <form
                                    action={toggleInvoicePaidAction}
                                >
                                    <input
                                        type="hidden"
                                        name="invoiceId"
                                        value={invoice.id}
                                    />

                                    <input
                                        type="hidden"
                                        name="projectId"
                                        value={projectId}
                                    />

                                    <button className="text-sm text-accent">
                                        {invoice.paid
                                            ? "Paid"
                                            : "Mark Paid"}
                                    </button>
                                </form>
                            ) : (
                                <span className="text-sm text-foreground/70">
                                    {invoice.paid
                                        ? "Paid"
                                        : "Unpaid"}
                                </span>
                            )}
                        </div>

                        <p className="mt-2 text-xs text-foreground/50">
                            Created{" "}
                            {invoice.createdAt.toLocaleDateString()}
                        </p>

                        {canManageProject && (
                            <form
                                action={deleteInvoiceAction}
                                className="mt-3"
                            >
                                <input
                                    type="hidden"
                                    name="invoiceId"
                                    value={invoice.id}
                                />

                                <input
                                    type="hidden"
                                    name="projectId"
                                    value={projectId}
                                />

                                <button
                                    aria-label={`Delete invoice for $${invoice.amount}`}
                                    className="text-xs text-red-400"
                                >
                                    Delete Invoice
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}