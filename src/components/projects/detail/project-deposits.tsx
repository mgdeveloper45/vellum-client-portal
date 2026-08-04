import { DepositPaymentHistory } from "@/components/deposits/deposit-payment-history";
import { DepositStatusBadge } from "@/components/deposits/deposit-status-badge";
import { formatMoney } from "@/lib/money";
import type {
  DepositViewModel,
} from "@/lib/services/deposit-payments/deposit-view-model";
import { RecordDepositPaymentDialog } from "@/components/deposits/record-deposit-payment-dialog";

type ProjectDepositsProps = {
  deposits: DepositViewModel[];
};

export function ProjectDeposits({
  deposits,
}: ProjectDepositsProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-medium">
        Deposits
      </h2>

      <div className="mt-4 grid gap-4">
        {deposits.length === 0 ? (
          <p className="text-sm text-foreground/60">
            No deposits requested yet.
          </p>
        ) : (
          deposits.map((deposit) => (
            <div
              key={deposit.id}
              className="rounded-xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {formatMoney(deposit.amount)}
                </p>

                <DepositStatusBadge
                  status={deposit.financialSummary.status}
                />
              </div>

              {deposit.dueDate && (
                <p className="mt-2 text-xs text-foreground/60">
                  Due{" "}
                  {deposit.dueDate.toLocaleDateString()}
                </p>
              )}

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Paid</span>

                  <span className="font-medium">
                    {formatMoney(
                      deposit.financialSummary.totalPaid,
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Remaining</span>

                  <span className="font-medium">
                    {formatMoney(
                      deposit.financialSummary.remainingBalance,
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Paid</span>

                  <span className="font-medium">
                    {deposit.financialSummary.percentPaid}%
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <DepositPaymentHistory
                  payments={deposit.payments}
                />

                <div className="mt-5">
                  <RecordDepositPaymentDialog
                    depositId={deposit.id}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}