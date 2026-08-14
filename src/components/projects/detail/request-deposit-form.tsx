import { requestDepositAction } from "@/actions/deposit-actions";

type RequestDepositFormProps = {
    projectId: string;
};

export function RequestDepositForm({
    projectId,
}: RequestDepositFormProps) {
    return (
        <section
            id="deposits"
            className="mt-8 scroll-mt-24 rounded-2xl border border-border bg-card p-6"
        >
            <h2 className="text-xl font-medium">
                Request Deposit
            </h2>

            <form
                action={requestDepositAction}
                className="mt-6 space-y-4"
            >
                <input
                    type="hidden"
                    name="projectId"
                    value={projectId}
                />

                <div>
                    <label className="text-sm font-medium">
                        Amount
                    </label>

                    <input
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        Due Date
                    </label>

                    <input
                        name="dueDate"
                        type="date"
                        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">
                        Notes
                    </label>

                    <textarea
                        name="notes"
                        rows={4}
                        className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3"
                    />
                </div>

                <button className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
                    Request Deposit
                </button>
            </form>
        </section>
    );
}