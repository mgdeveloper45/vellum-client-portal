import { createUserAction } from "@/actions/user-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function NewUserPage() {
    return (
        <DashboardShell>
            <h1 className="text-3xl font-light">New User</h1>

            <form
                action={createUserAction}
                className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6"
            >
                <input
                    name="firstName"
                    required
                    placeholder="First name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <input
                    name="lastName"
                    required
                    placeholder="Last name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <input
                    name="password"
                    type="password"
                    required
                    placeholder="Temporary password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <select
                    name="role"
                    defaultValue="CLIENT"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                >
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
                    Create User
                </button>
            </form>
        </DashboardShell>
    );
}