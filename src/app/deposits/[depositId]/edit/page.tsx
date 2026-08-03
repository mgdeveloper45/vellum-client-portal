import { auth } from "@/auth";
import { updateDepositAction } from "@/actions/deposit-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { getDepositForEditService } from "@/lib/services/deposits/composition/deposit-services";
import { canManageProjects } from "@/lib/permissions";

type Props = {
    params: Promise<{
        depositId: string;
    }>;
};

export default async function EditDepositPage({
    params,
}: Props) {
    const session = await auth();

    if (
        !session?.user ||
        !canManageProjects(session.user.role)
    ) {
        return null;
    }

    const { depositId } = await params;

    const workspaceId =
        await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
            session.user.id,
        );

    if (!workspaceId) {
        return null;
    }

    const result =
        await getDepositForEditService({
            workspaceId,
            depositId,
        });

    if (!result.success) {
        return (
            <DashboardShell>
                <p>Deposit not found.</p>
            </DashboardShell>
        );
    }

    const deposit = result.deposit;

    return (
        <DashboardShell>
            <h1 className="text-3xl font-light">
                Edit Deposit
            </h1>

            <form
                action={updateDepositAction}
                className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6"
            >
                <input
                    type="hidden"
                    name="depositId"
                    value={deposit.id}
                />

                <input
                    type="hidden"
                    name="projectId"
                    value={deposit.projectId}
                />

                <input
                    name="amount"
                    type="number"
                    step="0.01"
                    defaultValue={deposit.amount}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <input
                    name="dueDate"
                    type="date"
                    defaultValue={
                        deposit.dueDate
                            ? deposit.dueDate
                                .toISOString()
                                .split("T")[0]
                            : ""
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <textarea
                    name="notes"
                    defaultValue={deposit.notes}
                    className="min-h-32 w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <select
                    name="status"
                    defaultValue={deposit.status}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                >
                    <option value="REQUESTED">
                        Requested
                    </option>

                    <option value="PARTIALLY_PAID">
                        Partially Paid
                    </option>

                    <option value="PAID">
                        Paid
                    </option>

                    <option value="REFUNDED">
                        Refunded
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>
                </select>

                <select
                    name="paymentMethod"
                    defaultValue={
                        deposit.paymentMethod ?? ""
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                >
                    <option value="">
                        Select payment method
                    </option>

                    <option value="CASH">Cash</option>

                    <option value="CHECK">Check</option>

                    <option value="ACH">ACH</option>

                    <option value="CREDIT_CARD">
                        Credit Card
                    </option>

                    <option value="BANK_TRANSFER">
                        Bank Transfer
                    </option>

                    <option value="OTHER">Other</option>
                </select>

                <input
                    type="date"
                    name="paidAt"
                    defaultValue={
                        deposit.paidAt
                            ? deposit.paidAt
                                .toISOString()
                                .split("T")[0]
                            : ""
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
                    Save Changes
                </button>
            </form>
        </DashboardShell>
    );
}