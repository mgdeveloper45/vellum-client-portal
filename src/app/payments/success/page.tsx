import Link from "next/link";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

export default function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: {
        invoice?: string;
    };
}) {
    return (
        <BrandedDashboardShell>
            <div className="rounded-3xl border border-border bg-card p-8">
                <h1 className="text-3xl font-light">Payment successful</h1>

                <p className="mt-3 text-foreground/70">
                    Your payment was completed successfully.
                </p>

                <div className="mt-6 flex gap-3">
                    <Link
                        href="/invoices"
                        className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium"
                    >
                        Back to invoices
                    </Link>

                    {searchParams.invoice && (
                        <Link
                            href="/dashboard"
                            className="rounded-full border border-border px-5 py-3 text-sm font-medium"
                        >
                            Go to dashboard
                        </Link>
                    )}
                </div>
            </div>
        </BrandedDashboardShell>
    );
}