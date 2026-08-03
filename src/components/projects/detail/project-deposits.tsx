import { markDepositPaidAction } from "@/actions/deposit-actions";
import { DepositStatusBadge } from "@/components/deposits/deposit-status-badge";
import { formatMoney } from "@/lib/money";

import type {
    DepositSummaryRecord,
} from "@/lib/services/deposits/deposit-repository";

type ProjectDepositsProps = {
    deposits: DepositSummaryRecord[];
};

export function ProjectDeposits({
    deposits,
}: ProjectDepositsProps) {
    return (
        <section className="mt-10">
            <h2 className="text-xl font-medium">
                Deposits
            </h2>

            <div className="mt-4 grid gap-3">
                {deposits.length === 0 ? (
                    <p className="text-sm text-foreground/60">
                        No deposits requested yet.
                    </p>
                ) : (
                    deposits.map((deposit) => (
                        <div
                            key={deposit.id}
                            className="rounded-xl border border-border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-medium">
                                    {formatMoney(deposit.amount)}
                                </p>

                                <DepositStatusBadge
                                    status={deposit.status}
                                />
                            </div>

                            {deposit.dueDate && (
                                <p className="mt-2 text-xs text-foreground/60">
                                    Due{" "}
                                    {deposit.dueDate.toLocaleDateString()}
                                </p>
                            )}

                            {deposit.paidAt && (
                                <p className="mt-2 text-xs text-green-600">
                                    Paid{" "}
                                    {deposit.paidAt.toLocaleDateString()}
                                </p>
                            )}

                            {(deposit.status === "REQUESTED" ||
                                deposit.status === "PARTIALLY_PAID") && (
                                    <form
                                        action={markDepositPaidAction}
                                        className="mt-4"
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

                                        <button
                                            type="submit"
                                            className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                        >
                                            Mark Paid
                                        </button>
                                    </form>
                                )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}