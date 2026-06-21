import { notFound } from "next/navigation";
import { updateUserAction } from "@/actions/user-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

type Props = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function EditUserPage({
    params,
}: Props) {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        notFound();
    }

    return (
        <DashboardShell>
            <h1 className="text-3xl font-light">
                Edit User
            </h1>

            <form
                action={updateUserAction}
                className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6"
            >
                <input
                    type="hidden"
                    name="userId"
                    value={user.id}
                />

                <input
                    name="firstName"
                    defaultValue={user.firstName}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <input
                    name="lastName"
                    defaultValue={user.lastName}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <select
                    name="role"
                    defaultValue={user.role}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                >
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={user.isActive}
                    />

                    <span>Active User</span>
                </label>

                <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
                    Save Changes
                </button>
            </form>
        </DashboardShell>
    );
}