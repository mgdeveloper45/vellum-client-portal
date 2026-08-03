import { formatMoney } from "@/lib/money";
import { DepositStatusBadge } from "@/components/deposits/deposit-status-badge";
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
                                    {formatMoney(
                                        deposit.amount,
                                    )}
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
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}