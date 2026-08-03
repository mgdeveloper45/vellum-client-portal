import { formatMoney } from "@/lib/money";
import { formatStatus } from "@/lib/utils";

type Deposit = {
    id: string;
    amount: number;
    status: string;
    dueDate: Date | null;
    requestedAt: Date;
    paidAt: Date | null;
};

type ProjectDepositsProps = {
    deposits: Deposit[];
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
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                        <p className="text-sm text-foreground/60">
                            No deposits have been requested.
                        </p>
                    </div>
                ) : (
                    deposits.map((deposit) => (
                        <div
                            key={deposit.id}
                            className="rounded-xl border border-border bg-card p-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    {formatMoney(deposit.amount)}
                                </h3>

                                <span className="rounded-full border border-border px-3 py-1 text-xs">
                                    {formatStatus(deposit.status)}
                                </span>
                            </div>

                            <div className="mt-3 space-y-1 text-sm text-foreground/60">
                                <p>
                                    Requested{" "}
                                    {deposit.requestedAt.toLocaleDateString()}
                                </p>

                                {deposit.dueDate && (
                                    <p>
                                        Due{" "}
                                        {deposit.dueDate.toLocaleDateString()}
                                    </p>
                                )}

                                {deposit.paidAt && (
                                    <p>
                                        Paid{" "}
                                        {deposit.paidAt.toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}