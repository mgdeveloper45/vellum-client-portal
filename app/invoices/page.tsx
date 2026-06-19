import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function InvoicesPage() {
  return (
    <DashboardShell>
      <h1 className="text-3xl font-light">Invoices</h1>
      <p className="mt-2 text-foreground/70">
        Overview of projects, approvals, invoices, and client activity.
      </p>
    </DashboardShell>
  );
}