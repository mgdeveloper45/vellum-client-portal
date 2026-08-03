import { formatMoney } from "@/lib/money";

type ProjectFinancialSummaryProps = {
    depositTotal: number;
    invoiceTotal: number;
    outstandingBalance: number;
};

export function ProjectFinancialSummary({
    depositTotal,
    invoiceTotal,
    outstandingBalance,
}: ProjectFinancialSummaryProps) {
    return (
        <section className="mt-10">
            <h2 className="text-xl font-medium">
                Financial Summary
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-sm text-foreground/60">
                        Deposits
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {formatMoney(depositTotal)}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-sm text-foreground/60">
                        Invoices
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {formatMoney(invoiceTotal)}
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-sm text-foreground/60">
                        Outstanding Balance
                    </p>

                    <p className="mt-2 text-3xl font-semibold">
                        {formatMoney(outstandingBalance)}
                    </p>
                </div>
            </div>
        </section>
    );
}