import { formatMoney } from "@/lib/money";

import type {
    DepositPaymentRecord,
} from "@/lib/services/deposit-payments/deposit-payment-repository";

type DepositPaymentHistoryProps = {
    payments: DepositPaymentRecord[];
};

export function DepositPaymentHistory({
    payments,
}: DepositPaymentHistoryProps) {
    if (payments.length === 0) {
        return (
            <p className="text-sm text-foreground/60">
                No payments recorded.
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {payments.map((payment) => (
                <div
                    key={payment.id}
                    className="rounded-lg border border-border p-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">
                                {formatMoney(payment.amount)}
                            </p>

                            <p className="text-xs text-foreground/60">
                                {payment.paymentMethod.replaceAll(
                                    "_",
                                    " ",
                                )}
                            </p>
                        </div>

                        <p className="text-xs text-foreground/60">
                            {payment.receivedAt.toLocaleDateString()}
                        </p>
                    </div>

                    {payment.notes && (
                        <p className="mt-3 text-sm text-foreground/70">
                            {payment.notes}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}