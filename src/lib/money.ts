export function formatMoney(
    amount: number | string,
): string {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
        },
    ).format(Number(amount));
}

export function isValidMoneyAmount(
    amount: number,
): boolean {
    return Number.isFinite(amount) && amount > 0;
}

export function normalizeMoneyAmount(
    amount: number,
): number {
    return Math.round(amount * 100) / 100;
}