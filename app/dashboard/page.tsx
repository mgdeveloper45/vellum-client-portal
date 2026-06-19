import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/ui/stat-card";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <h1 className="text-3xl font-light">Dashboard</h1>
      <p className="mt-2 text-foreground/70">
        Overview of projects, approvals, invoices, and client activity.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Active Projects" value="6" helper="2 need review" />
        <StatCard label="Open Invoices" value="$12.4k" helper="3 unpaid" />
        <StatCard label="Pending Approvals" value="4" helper="Client action needed" />
        <StatCard label="Unread Messages" value="9" helper="Across 5 projects" />
      </div>
    </DashboardShell>
  );
}