"use client";

import { useState } from "react";

import { recordDepositPaymentAction } from "@/actions/deposit-payment-actions";

type RecordDepositPaymentDialogProps = {
    depositId: string;
};

export function RecordDepositPaymentDialog({
    depositId,
}: RecordDepositPaymentDialogProps) {
    const [open, setOpen] = useState(false);

    if (!open) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
                Record Payment
            </button>
        );
    }

    return (
        <form
            action={recordDepositPaymentAction}
            className="mt-4 space-y-4 rounded-xl border border-border p-4"
        >
            <input
                type="hidden"
                name="depositId"
                value={depositId}
            />

            <div>
                <label className="text-sm font-medium">
                    Amount
                </label>

                <input
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    required
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                />
            </div>

            <div>
                <label className="text-sm font-medium">
                    Payment Method
                </label>

                <select
                    name="paymentMethod"
                    required
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                >
                    <option value="CREDIT_CARD">
                        Credit Card
                    </option>

                    <option value="ACH">
                        ACH
                    </option>

                    <option value="CHECK">
                        Check
                    </option>

                    <option value="CASH">
                        Cash
                    </option>

                    <option value="BANK_TRANSFER">
                        Bank Transfer
                    </option>

                    <option value="OTHER">
                        Other
                    </option>
                </select>
            </div>

            <div>
                <label className="text-sm font-medium">
                    Notes
                </label>

                <textarea
                    name="notes"
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                />
            </div>

            <div className="flex gap-2">
                <button
                    className="rounded-full bg-primary px-4 py-2 text-primary-foreground"
                >
                    Save Payment
                </button>

                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border px-4 py-2"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}