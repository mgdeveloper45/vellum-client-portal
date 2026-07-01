import Link from "next/link";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

export default function PaymentCancelPage() {
    return (
        <BrandedDashboardShell>
            <div className="rounded-3xl border border-border bg-card p-8">
                <h1 className="text-3xl font-light">Payment cancelled</h1>

                <p className="mt-3 text-foreground/70">
                    No payment was made. You can return to invoices and try again.
                </p>

                <Link
                    href="/invoices"
                    className="mt-6 inline-block rounded-full border border-border px-5 py-3 text-sm font-medium"
                >
                    Back to invoices
                </Link>
            </div>
        </BrandedDashboardShell>
    );
}